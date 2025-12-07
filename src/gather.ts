import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Lexer } from 'marked';
import { extractH1, parseLeafContent } from './build/related.js';
import type { GatheredArticle, ParsedLeaf, ParsedLink } from './build/types.js';

/**
 * Resolve a relative link href to an absolute file path.
 */
const resolveHref = (href: string, baseDir: string): string => {
  // Handle .md file links
  if (href.endsWith('.md')) {
    return resolve(baseDir, href);
  }
  // Default: assume it's a .md file reference
  return resolve(baseDir, href);
};

/**
 * Extract title from markdown content.
 * Uses H1 if present, otherwise returns null.
 */
const extractTitle = (content: string): string | null => {
  const lexer = new Lexer();
  const tokens = lexer.lex(content);
  return extractH1(tokens);
};

/**
 * Read and parse a leaf article file asynchronously.
 */
const readArticle = async (
  filePath: string,
): Promise<{
  content: string;
  readFirst: ParsedLink[];
  readNext: ParsedLink[];
} | null> => {
  try {
    const rawContent = await readFile(filePath, 'utf8');
    const parsed = parseLeafContent(rawContent);
    return {
      content: parsed.content,
      readFirst: parsed.related.readFirst,
      readNext: parsed.related.readNext,
    };
  } catch {
    return null;
  }
};

/**
 * Internal recursive function to gather articles.
 * Reads files asynchronously and tracks visited paths for cycle detection.
 */
const gatherArticlesRecursive = async (
  filePath: string,
  label: string,
  visited: Set<string>,
): Promise<GatheredArticle[]> => {
  const absolutePath = resolve(filePath);

  // Cycle detection
  if (visited.has(absolutePath)) {
    return [];
  }
  visited.add(absolutePath);

  const article = await readArticle(absolutePath);
  if (!article) {
    // File not found or couldn't be read - skip
    return [];
  }

  const baseDir = dirname(absolutePath);
  const result: GatheredArticle[] = [];

  // Gather Read First articles recursively
  for (const link of article.readFirst) {
    const linkedPath = resolveHref(link.href, baseDir);
    const gathered = await gatherArticlesRecursive(linkedPath, link.label, visited);
    result.push(...gathered);
  }

  // Add this article
  const title = extractTitle(article.content) ?? label;
  result.push({
    title,
    content: article.content,
    isMain: false, // Will be corrected by caller
    path: absolutePath,
  });

  // Gather Read Next articles recursively
  for (const link of article.readNext) {
    const linkedPath = resolveHref(link.href, baseDir);
    const gathered = await gatherArticlesRecursive(linkedPath, link.label, visited);
    result.push(...gathered);
  }

  return result;
};

/**
 * Gather related articles starting from already-parsed content.
 *
 * This avoids double-reading the main file by accepting the already-parsed
 * content and only reading related files.
 *
 * @example
 * const parsed = parseLeafContent(rawContent);
 * const articles = await gatherFromParsed('/path/to/main.md', 'Main', parsed);
 */
export const gatherFromParsed = async (
  mainFilePath: string,
  mainLabel: string,
  mainParsed: ParsedLeaf,
): Promise<GatheredArticle[]> => {
  const absolutePath = resolve(mainFilePath);
  const visited = new Set<string>();
  visited.add(absolutePath);

  const baseDir = dirname(absolutePath);
  const result: GatheredArticle[] = [];

  // Gather Read First articles recursively
  for (const link of mainParsed.related.readFirst) {
    const linkedPath = resolveHref(link.href, baseDir);
    const gathered = await gatherArticlesRecursive(linkedPath, link.label, visited);
    result.push(...gathered);
  }

  // Add main article
  const title = extractTitle(mainParsed.content) ?? mainLabel;
  result.push({
    title,
    content: mainParsed.content,
    isMain: true,
    path: absolutePath,
  });

  // Gather Read Next articles recursively
  for (const link of mainParsed.related.readNext) {
    const linkedPath = resolveHref(link.href, baseDir);
    const gathered = await gatherArticlesRecursive(linkedPath, link.label, visited);
    result.push(...gathered);
  }

  return result;
};

/**
 * Gather all related articles for a leaf document.
 *
 * This is a convenience function that reads and parses the main file.
 * If you already have the parsed content, use `gatherFromParsed` instead
 * to avoid double-reading the file.
 *
 * Algorithm:
 * 1. If article already visited, skip (cycle detection)
 * 2. Add to visited set
 * 3. Recursively gather Read First articles
 * 4. Add main article
 * 5. Recursively gather Read Next articles
 *
 * @example
 * // Article A has Read First: [B], Read Next: [C]
 * // Article B has Read First: [D]
 * // Result: [D, B, A, C]
 * const articles = await gatherRelatedArticles('/path/to/a.md', 'Article A');
 */
export const gatherRelatedArticles = async (
  mainFilePath: string,
  mainLabel: string,
): Promise<GatheredArticle[]> => {
  const absolutePath = resolve(mainFilePath);

  const article = await readArticle(absolutePath);
  if (!article) {
    return [];
  }

  const parsed: ParsedLeaf = {
    content: article.content,
    related: {
      readFirst: article.readFirst,
      readNext: article.readNext,
    },
  };

  return gatherFromParsed(mainFilePath, mainLabel, parsed);
};

/**
 * Format gathered articles for CLI display.
 *
 * @example
 * formatArticlesForCli(articles)
 * // Returns formatted string with separators between articles
 */
export const formatArticlesForCli = (articles: GatheredArticle[]): string => {
  const SEPARATOR = '━'.repeat(40);

  return articles
    .map((article) => {
      const marker = article.isMain ? ' (main)' : '';
      const header = `${SEPARATOR}\n📖 ${article.title}${marker}\n${SEPARATOR}`;
      return `${header}\n\n${article.content}`;
    })
    .join('\n\n');
};

/**
 * Format gathered articles for markdown export.
 *
 * @example
 * formatArticlesForMarkdown(articles)
 * // Returns concatenated markdown with horizontal rules
 */
export const formatArticlesForMarkdown = (articles: GatheredArticle[]): string => {
  return articles.map((article) => article.content).join('\n\n---\n\n');
};
