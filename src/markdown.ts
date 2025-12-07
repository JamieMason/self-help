import { existsSync, statSync } from "node:fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import type { Node } from "./index.js";
import { toMarkdownFile } from "./lib/markdown.js";
import { tryPanicAsync } from "./lib/try-panic.js";
import { createMarkdownSource } from "./source/index.js";

interface HelpDocumentSource {
	getHelpDocument: () => Node | Promise<Node>;
}

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

	const markdown = await toMarkdownFile(tree);
	console.log(markdown);
};
