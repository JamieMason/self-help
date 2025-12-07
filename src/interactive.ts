import { existsSync, statSync } from "node:fs";
import { isCancel, select } from "@clack/prompts";
import { resolve } from "path";
import c from "tinyrainbow";
import type { WriteStream } from "tty";
import { pathToFileURL } from "url";
import type { Branch, Node } from "./index.js";
import { renderToCli } from "./lib/markdown.js";
import { tryPanicAsync } from "./lib/try-panic.js";
import {
	createTreeInterpreter,
	type TreeActor,
	type TreeContext,
} from "./machine/tree/index.js";
import { isBranch, isLeaf } from "./machine/tree/nodes.js";
import { createMarkdownSource } from "./source/index.js";

interface HelpDocumentSource {
	getHelpDocument: () => Node | Promise<Node>;
}

const stdout = process.stdout as WriteStream;
const LOADING_MESSAGE = "! Loading...";

const getOptions = (node: Branch) =>
	node.children.map((child: Node, i: number) => ({
		label: child.label,
		value: i,
	}));

/**
 * Check if a path is a directory.
 */
const isDirectory = (path: string): boolean => {
	try {
		return existsSync(path) && statSync(path).isDirectory();
	} catch {
		return false;
	}
};

/**
 * Check if a path is a markdown source directory (contains README.md).
 */
const isMarkdownSource = (path: string): boolean => {
	if (!isDirectory(path)) return false;
	return existsSync(resolve(path, "README.md"));
};

export const run = async ({ sourcePath }: { sourcePath: string }) => {
	const dataPath = resolve(process.cwd(), sourcePath);

	let tree: Node;

	if (isMarkdownSource(dataPath)) {
		// Markdown directory source — use lazy adapter
		tree = createMarkdownSource(dataPath);
	} else {
		// JavaScript module source — import and call getHelpDocument()
		const fileUrl = pathToFileURL(dataPath).href;
		const IMPORT_ERROR = `Failed to import('${dataPath}');`;
		const source = (await tryPanicAsync(
			() => import(fileUrl),
			IMPORT_ERROR,
		)) as HelpDocumentSource;
		const GET_DOCUMENT_ERROR = `Failed to call getHelpDocument() from ${dataPath}`;
		tree = (await tryPanicAsync(
			() => source.getHelpDocument(),
			GET_DOCUMENT_ERROR,
		)) as Node;
	}

	const interpreter = createTreeInterpreter(tree);
	start(interpreter);
};

export const start = async (interpreter: TreeActor): Promise<void> => {
	let wasLoading = false;
	let promptPending = false;

	const renderChoice = (currentNode: Node) => {
		console.log(c.green("✔"), c.bold(currentNode.label));
	};

	const showLoadingStatus = (currentNode: Node) => {
		renderChoice(currentNode);
		stdout.write(c.yellow(LOADING_MESSAGE));
	};

	const hideLoadingStatus = () => {
		if (stdout.isTTY) {
			stdout.clearLine(0);
			stdout.moveCursor(-LOADING_MESSAGE.length, 0);
			stdout.moveCursor(0, -1);
			stdout.clearLine(0);
			stdout.write("");
		}
	};

	const listChildNodes = async (branch: Branch) => {
		if (promptPending) {
			return;
		}
		promptPending = true;

		try {
			const result = await select({
				message: branch.label,
				options: getOptions(branch),
			});

			if (isCancel(result)) {
				promptPending = false;
				process.exit(0);
			}

			const childIndex = result;

			// Reset promptPending BEFORE sending the event to avoid race condition
			// where the state transition triggers a new subscription callback
			// while we're still inside this try block
			promptPending = false;
			interpreter.send({
				type: "SELECT_CHILD",
				childIndex,
			});
		} catch (err) {
			promptPending = false;
			throw err;
		}
	};

	const renderValue = (value: string) => {
		console.log("");
		console.log(renderToCli(value));
	};

	interpreter.subscribe((snapshot) => {
		const context = snapshot.context as TreeContext;
		const currentNode = context.currentNode;

		const isLoadingBranch = snapshot.matches({ resolveBranch: "loading" });
		const isLoadingLeaf = snapshot.matches({ resolveLeaf: "loading" });
		const isLoading = isLoadingBranch || isLoadingLeaf;
		const isRenderBranch = snapshot.matches("renderBranch");
		const isRenderLeaf = snapshot.matches("renderLeaf");
		const isRenderValue = snapshot.matches("renderValue");

		// Handle loading state
		if (isLoading && !wasLoading) {
			wasLoading = true;
			showLoadingStatus(currentNode);
			return;
		}

		// Hide loading when we leave the loading state
		if (wasLoading && !isLoading) {
			wasLoading = false;
			hideLoadingStatus();
		}

		// Handle render states
		if (isRenderBranch && isBranch(currentNode)) {
			listChildNodes(currentNode);
		} else if (isRenderLeaf) {
			renderChoice(currentNode);
			interpreter.send({ type: "FINALISE" });
		} else if (isRenderValue) {
			// The leaf value already includes gathered related articles (if any)
			// because gathering is handled inside the leaf's value() function
			const value =
				context.resolvedValue ?? (isLeaf(currentNode) ? currentNode.value : "");
			renderValue(value);
		}
	});

	interpreter.start();
};
