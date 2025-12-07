import { existsSync, readFileSync as fsReadFileSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parseIndexContent } from "../build/parser.js";
import { hasRelatedArticles, parseLeafContent } from "../build/related.js";
import type { ParsedLink } from "../build/types.js";
import { formatArticlesForCli, gatherFromParsed } from "../gather.js";
import type { AsyncBranch, AsyncLeaf, Node } from "../index.js";

const INDEX_FILE = "README.md";

/**
 * Error thrown when markdown source validation fails.
 */
export class MarkdownSourceError extends Error {
	constructor(
		message: string,
		public readonly path: string,
	) {
		super(`${message} (${path})`);
		this.name = "MarkdownSourceError";
	}
}

/**
 * Check if a path points to a directory.
 */
const isDirectory = (path: string): boolean => {
	try {
		return statSync(path).isDirectory();
	} catch {
		return false;
	}
};

/**
 * Check if a path points to a file.
 */
const isFile = (path: string): boolean => {
	try {
		return statSync(path).isFile();
	} catch {
		return false;
	}
};

/**
 * Resolve a link href to an absolute path and determine its type.
 */
const resolveLink = (
	href: string,
	baseDir: string,
): { path: string; type: "branch" | "leaf" } | null => {
	// Normalise href - remove trailing slash for consistent handling
	const normalisedHref = href.endsWith("/") ? href.slice(0, -1) : href;

	// Handle explicit README.md links
	if (normalisedHref.endsWith("/README.md")) {
		const folderPath = resolve(baseDir, dirname(normalisedHref));
		const indexPath = resolve(baseDir, normalisedHref);
		if (isDirectory(folderPath) && isFile(indexPath)) {
			return { path: indexPath, type: "branch" };
		}
		return null;
	}

	// Handle .md file links (leaf)
	if (normalisedHref.endsWith(".md")) {
		const filePath = resolve(baseDir, normalisedHref);
		if (isFile(filePath)) {
			return { path: filePath, type: "leaf" };
		}
		return null;
	}

	// Handle folder links (branch)
	const folderPath = resolve(baseDir, normalisedHref);
	const indexPath = join(folderPath, INDEX_FILE);
	if (isDirectory(folderPath) && isFile(indexPath)) {
		return { path: indexPath, type: "branch" };
	}

	return null;
};

/**
 * Read file content synchronously for validation during source creation.
 */
const readFileSync = (path: string): string => fsReadFileSync(path, "utf8");

/**
 * Create an AsyncLeaf node from a markdown file path.
 *
 * The value function:
 * 1. Reads and parses the file asynchronously
 * 2. If the file has related articles, gathers them recursively
 * 3. Returns formatted content with all related articles
 *
 * This approach:
 * - Reads the main file only once (no double reading)
 * - Uses async I/O throughout
 * - Keeps gathering logic encapsulated in the value function
 */
const createLeafNode = (label: string, filePath: string): AsyncLeaf => ({
	label,
	value: async () => {
		if (!isFile(filePath)) {
			throw new MarkdownSourceError("Leaf file not found", filePath);
		}

		const rawContent = await readFile(filePath, "utf8");
		const parsed = parseLeafContent(rawContent);

		// If no related articles, return the content as-is
		if (!hasRelatedArticles(parsed)) {
			return parsed.content;
		}

		// Gather all related articles using the already-parsed content
		// This avoids double-reading the main file
		const articles = await gatherFromParsed(filePath, label, parsed);

		// Format for CLI display with separators
		return formatArticlesForCli(articles);
	},
});

/**
 * Create an AsyncBranch node from an index file path.
 */
const createBranchNode = (label: string, indexPath: string): AsyncBranch => ({
	label,
	children: () => Promise.resolve(loadChildren(indexPath)),
});

/**
 * Load children from an index file.
 */
const loadChildren = (indexPath: string): Node[] => {
	const baseDir = dirname(indexPath);

	// Read and parse the index file
	if (!isFile(indexPath)) {
		throw new MarkdownSourceError("Index file not found", indexPath);
	}

	const content = readFileSync(indexPath);
	const { result: parsed, errors } = parseIndexContent(content);

	if (!parsed || errors.length > 0) {
		const errorMessages = errors.map((e) => e.message).join("; ");
		throw new MarkdownSourceError(
			errorMessages || "Failed to parse index",
			indexPath,
		);
	}

	// Convert parsed links to nodes
	return parsed.children.map((link: ParsedLink) => {
		const resolved = resolveLink(link.href, baseDir);

		if (!resolved) {
			throw new MarkdownSourceError(
				`Link target not found: "${link.href}"`,
				indexPath,
			);
		}

		if (resolved.type === "leaf") {
			return createLeafNode(link.label, resolved.path);
		}

		return createBranchNode(link.label, resolved.path);
	});
};

/**
 * Create a help document source from a markdown directory.
 *
 * Returns an AsyncBranch that lazily loads its children from `README.md`.
 * Each navigation re-reads the files (no caching).
 *
 * Leaf nodes with `## Read First` or `## Read Next` sections will
 * automatically gather and format all related articles when their
 * value is resolved.
 *
 * @example
 * const root = createMarkdownSource('./docs')
 * // root is an AsyncBranch with label from docs/README.md H1
 * // and children() that parses the links in docs/README.md
 */
export const createMarkdownSource = (dirPath: string): AsyncBranch => {
	const resolvedPath = resolve(dirPath);
	const indexPath = isDirectory(resolvedPath)
		? join(resolvedPath, INDEX_FILE)
		: resolvedPath;

	// Validate root exists (fail fast for root only)
	if (!existsSync(indexPath)) {
		throw new MarkdownSourceError("Root README.md not found", indexPath);
	}

	// Read root label from H1
	const content = readFileSync(indexPath);
	const { result: parsed, errors } = parseIndexContent(content);

	if (!parsed || errors.length > 0) {
		const errorMessages = errors.map((e) => e.message).join("; ");
		throw new MarkdownSourceError(
			errorMessages || "Failed to parse root index",
			indexPath,
		);
	}

	return {
		label: parsed.label,
		children: () => Promise.resolve(loadChildren(indexPath)),
	};
};
