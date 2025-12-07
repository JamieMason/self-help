import { Lexer, type Token, type Tokens } from "marked";

import type { ParsedIndex, ParsedLink, ValidationError } from "./types.js";

/**
 * Check if a token is a heading.
 */
const isHeading = (token: Token): token is Tokens.Heading =>
	token.type === "heading";

/**
 * Check if a token is a list.
 */
const isList = (token: Token): token is Tokens.List => token.type === "list";

/**
 * Check if a token is a link.
 */
const isLink = (token: Token): token is Tokens.Link => token.type === "link";

/**
 * Extract the first H1 heading from tokens.
 */
const extractH1 = (tokens: Token[]): string | null => {
	const h1 = tokens.find((token) => isHeading(token) && token.depth === 1);
	return h1 && isHeading(h1) ? h1.text : null;
};

/**
 * Extract links from a list item's tokens (recursive).
 */
const extractLinksFromTokens = (tokens: Token[]): ParsedLink[] => {
	const links: ParsedLink[] = [];

	for (const token of tokens) {
		if (isLink(token)) {
			links.push({ label: token.text, href: token.href });
		}
		if ("tokens" in token && Array.isArray(token.tokens)) {
			links.push(...extractLinksFromTokens(token.tokens));
		}
		if ("items" in token && Array.isArray(token.items)) {
			for (const item of token.items) {
				if ("tokens" in item && Array.isArray(item.tokens)) {
					links.push(...extractLinksFromTokens(item.tokens));
				}
			}
		}
	}

	return links;
};

/**
 * Extract ordered links from list items in tokens.
 */
const extractLinks = (tokens: Token[]): ParsedLink[] => {
	const links: ParsedLink[] = [];

	for (const token of tokens) {
		if (isList(token)) {
			for (const item of token.items) {
				const itemLinks = extractLinksFromTokens(item.tokens);
				links.push(...itemLinks);
			}
		}
	}

	return links;
};

/**
 * Parse an `README.md` file content and extract the branch label (H1) and child links.
 *
 * @example
 * parseIndexContent('# My Branch\n\n- [Child 1](./child1.md)\n- [Child 2](./child2/)')
 * // => { label: 'My Branch', children: [{ label: 'Child 1', href: './child1.md' }, ...] }
 */
export const parseIndexContent = (
	content: string,
): { result: ParsedIndex | null; errors: ValidationError[] } => {
	const errors: ValidationError[] = [];
	const lexer = new Lexer();
	const tokens = lexer.lex(content);

	const label = extractH1(tokens);
	if (!label) {
		errors.push({
			path: "",
			message: "README.md must contain an H1 heading as the first heading",
		});
	}

	const children = extractLinks(tokens);
	if (children.length === 0) {
		errors.push({
			path: "",
			message:
				"README.md must contain at least one link in a list to define children",
		});
	}

	if (errors.length > 0 || !label) {
		return { result: null, errors };
	}

	return {
		result: { label, children },
		errors: [],
	};
};

/**
 * Validate that a parsed index has all required fields.
 */
export const validateParsedIndex = (
	parsed: ParsedIndex,
	filePath: string,
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!parsed.label || parsed.label.trim() === "") {
		errors.push({
			path: filePath,
			message: "Branch label (H1) cannot be empty",
		});
	}

	if (parsed.children.length === 0) {
		errors.push({
			path: filePath,
			message: "Branch must have at least one child link",
		});
	}

	for (const child of parsed.children) {
		if (!child.label || child.label.trim() === "") {
			errors.push({
				path: filePath,
				message: `Link to "${child.href}" has empty label text`,
			});
		}
		if (!child.href || child.href.trim() === "") {
			errors.push({
				path: filePath,
				message: `Link "${child.label}" has empty href`,
			});
		}
	}

	return errors;
};
