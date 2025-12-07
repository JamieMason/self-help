/**
 * Parsed link from `README.md` child list.
 */
export interface ParsedLink {
	/** Link text (becomes the node label) */
	label: string;
	/** Link target (relative path) */
	href: string;
}

/**
 * Related articles parsed from leaf markdown files.
 * These are links found in `## Read First` and `## Read Next` sections.
 */
export interface RelatedArticles {
	/** Articles to render before the main content */
	readFirst: ParsedLink[];
	/** Articles to render after the main content */
	readNext: ParsedLink[];
}

/**
 * Result of parsing a leaf markdown file for related articles.
 */
export interface ParsedLeaf {
	/** Main content with Read First/Next sections removed */
	content: string;
	/** Related articles */
	related: RelatedArticles;
}

/**
 * Gathered article ready for rendering.
 */
export interface GatheredArticle {
	/** Article title (from H1 or filename) */
	title: string;
	/** Article content (markdown) */
	content: string;
	/** Whether this is the main article the user navigated to */
	isMain: boolean;
	/** Absolute path to the article file */
	path: string;
}

/**
 * Result of parsing an `README.md` file.
 */
export interface ParsedIndex {
	/** H1 heading (becomes the branch label) */
	label: string;
	/** Ordered list of child links */
	children: ParsedLink[];
}

/**
 * Validation error during parsing.
 */
export interface ValidationError {
	/** Path to the file with the error */
	path: string;
	/** Error message */
	message: string;
}
