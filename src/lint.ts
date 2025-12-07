import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import c from "tinyrainbow";

import { parseIndexContent } from "./build/parser.js";
import { parseLeafContent } from "./build/related.js";
import type { ValidationError } from "./build/types.js";

const INDEX_FILE = "README.md";

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
 * Check if a path is a file.
 */
const isFile = (path: string): boolean => {
	try {
		return existsSync(path) && statSync(path).isFile();
	} catch {
		return false;
	}
};

/**
 * Resolve a link href to an absolute path and determine its type.
 */
const resolveLinkTarget = (href: string, baseDir: string): string | null => {
	const normalisedHref = href.endsWith("/") ? href.slice(0, -1) : href;

	if (normalisedHref.endsWith("/README.md")) {
		const indexPath = resolve(baseDir, normalisedHref);
		if (isFile(indexPath)) {
			return indexPath;
		}
		return null;
	}

	if (normalisedHref.endsWith(".md")) {
		const filePath = resolve(baseDir, normalisedHref);
		if (isFile(filePath)) {
			return filePath;
		}
		return null;
	}

	const folderPath = resolve(baseDir, normalisedHref);
	const indexPath = join(folderPath, INDEX_FILE);
	if (isDirectory(folderPath) && isFile(indexPath)) {
		return indexPath;
	}

	return null;
};

const resolveLink = (
	href: string,
	baseDir: string,
): { path: string; type: "branch" | "leaf" } | null => {
	const normalisedHref = href.endsWith("/") ? href.slice(0, -1) : href;

	if (normalisedHref.endsWith("/README.md")) {
		const folderPath = resolve(baseDir, dirname(normalisedHref));
		const indexPath = resolve(baseDir, normalisedHref);
		if (isDirectory(folderPath) && isFile(indexPath)) {
			return { path: indexPath, type: "branch" };
		}
		return null;
	}

	if (normalisedHref.endsWith(".md")) {
		const filePath = resolve(baseDir, normalisedHref);
		if (isFile(filePath)) {
			return { path: filePath, type: "leaf" };
		}
		return null;
	}

	const folderPath = resolve(baseDir, normalisedHref);
	const indexPath = join(folderPath, INDEX_FILE);
	if (isDirectory(folderPath) && isFile(indexPath)) {
		return { path: indexPath, type: "branch" };
	}

	return null;
};

/**
 * Lint a leaf file for related article links.
 */
const lintLeafRelatedLinks = (
	leafPath: string,
	errors: ValidationError[],
	visited: Set<string>,
): void => {
	const baseDir = dirname(leafPath);

	let content: string;
	try {
		content = readFileSync(leafPath, "utf8");
	} catch {
		return; // File already validated to exist by parent
	}

	const parsed = parseLeafContent(content);

	// Validate Read First links
	for (const link of parsed.related.readFirst) {
		const resolvedPath = resolveLinkTarget(link.href, baseDir);

		if (!resolvedPath) {
			errors.push({
				path: leafPath,
				message: `Read First link target not found: "${link.href}" (label: "${link.label}")`,
			});
			continue;
		}

		// Warn if linking to a branch README.md
		if (resolvedPath.endsWith(INDEX_FILE)) {
			errors.push({
				path: leafPath,
				message: `Read First should link to leaves, not branches: "${link.href}" (label: "${link.label}")`,
			});
		}
	}

	// Validate Read Next links
	for (const link of parsed.related.readNext) {
		const resolvedPath = resolveLinkTarget(link.href, baseDir);

		if (!resolvedPath) {
			errors.push({
				path: leafPath,
				message: `Read Next link target not found: "${link.href}" (label: "${link.label}")`,
			});
			continue;
		}

		// Warn if linking to a branch README.md
		if (resolvedPath.endsWith(INDEX_FILE)) {
			errors.push({
				path: leafPath,
				message: `Read Next should link to leaves, not branches: "${link.href}" (label: "${link.label}")`,
			});
		}
	}

	// Check for circular dependencies (informational)
	const allRelatedLinks = [
		...parsed.related.readFirst,
		...parsed.related.readNext,
	];
	for (const link of allRelatedLinks) {
		const resolvedPath = resolveLinkTarget(link.href, baseDir);
		if (resolvedPath && visited.has(resolvedPath)) {
			// This is just informational - the runtime handles cycles gracefully
			// but it's worth noting during lint
		}
	}
};

/**
 * Recursively lint a branch and all its children.
 */
const lintBranch = (
	indexPath: string,
	errors: ValidationError[],
	visited: Set<string>,
): void => {
	// Avoid infinite loops from circular references
	if (visited.has(indexPath)) {
		return;
	}
	visited.add(indexPath);

	const baseDir = dirname(indexPath);

	// Read the index file
	let content: string;
	try {
		content = readFileSync(indexPath, "utf8");
	} catch (err) {
		errors.push({
			path: indexPath,
			message: `Failed to read file: ${err instanceof Error ? err.message : String(err)}`,
		});
		return;
	}

	// Parse and collect errors
	const { result: parsed, errors: parseErrors } = parseIndexContent(content);
	for (const error of parseErrors) {
		errors.push({
			path: indexPath,
			message: error.message,
		});
	}

	if (!parsed) {
		return;
	}

	// Validate each child link
	for (const link of parsed.children) {
		const resolved = resolveLink(link.href, baseDir);

		if (!resolved) {
			errors.push({
				path: indexPath,
				message: `Link target not found: "${link.href}" (label: "${link.label}")`,
			});
			continue;
		}

		if (resolved.type === "branch") {
			// Recursively lint branch
			lintBranch(resolved.path, errors, visited);
		} else {
			// Lint leaf for related article links
			lintLeafRelatedLinks(resolved.path, errors, visited);
		}
	}
};

/**
 * Result of linting a markdown source directory.
 */
export interface LintResult {
	/** Whether the lint passed with no errors */
	success: boolean;
	/** All validation errors found */
	errors: ValidationError[];
}

/**
 * Lint a markdown source directory, validating the entire tree structure.
 *
 * @example
 * const result = lint('./docs')
 * if (!result.success) {
 *   console.log(result.errors)
 * }
 */
export const lint = (sourcePath: string): LintResult => {
	const errors: ValidationError[] = [];
	const visited = new Set<string>();

	const resolvedPath = resolve(sourcePath);
	const indexPath = isDirectory(resolvedPath)
		? join(resolvedPath, INDEX_FILE)
		: resolvedPath;

	if (!existsSync(indexPath)) {
		errors.push({
			path: indexPath,
			message: "Root README.md not found",
		});
		return { success: false, errors };
	}

	lintBranch(indexPath, errors, visited);

	return {
		success: errors.length === 0,
		errors,
	};
};

/**
 * Run the lint command from CLI.
 */
export const run = ({ sourcePath }: { sourcePath: string }): void => {
	console.log(c.cyan("Linting markdown source..."));
	console.log(`  Source: ${sourcePath}`);
	console.log();

	const result = lint(sourcePath);

	if (result.success) {
		console.log(c.green("✓ No errors found"));
	} else {
		console.log(c.red(`✗ Found ${result.errors.length} error(s)`));
		console.log();

		for (const error of result.errors) {
			console.log(c.yellow(`  ${error.path}`));
			console.log(`    ${error.message}`);
		}

		process.exit(1);
	}
};
