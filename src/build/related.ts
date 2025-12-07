import { Lexer, type Token, type Tokens } from 'marked';

import type { ParsedLeaf, ParsedLink, RelatedArticles } from './types.js';

/**
 * Check if a token is a heading.
 */
const isHeading = (token: Token): token is Tokens.Heading => token.type === 'heading';

/**
 * Check if a token is a list.
 */
const isList = (token: Token): token is Tokens.List => token.type === 'list';

/**
 * Check if a token is a link.
 */
const isLink = (token: Token): token is Tokens.Link => token.type === 'link';

/**
 * Extract the first H1 heading text from tokens.
 */
export const extractH1 = (tokens: Token[]): string | null => {
  const h1 = tokens.find((token) => isHeading(token) && token.depth === 1);
  return h1 && isHeading(h1) ? h1.text : null;
};

/**
 * Extract links from list items in tokens.
 */
const extractLinksFromTokens = (tokens: Token[]): ParsedLink[] => {
  const links: ParsedLink[] = [];

  for (const token of tokens) {
    if (isLink(token)) {
      links.push({ label: token.text, href: token.href });
    }
    if ('tokens' in token && Array.isArray(token.tokens)) {
      links.push(...extractLinksFromTokens(token.tokens));
    }
    if ('items' in token && Array.isArray(token.items)) {
      for (const item of token.items) {
        if ('tokens' in item && Array.isArray(item.tokens)) {
          links.push(...extractLinksFromTokens(item.tokens));
        }
      }
    }
  }

  return links;
};

/**
 * Find the index of an H2 heading with the specified text.
 */
const findH2Index = (tokens: Token[], text: string): number =>
  tokens.findIndex(
    (token) =>
      isHeading(token) && token.depth === 2 && token.text.toLowerCase() === text.toLowerCase(),
  );

/**
 * Find the index of the next heading at depth <= targetDepth after startIndex.
 */
const findNextHeadingIndex = (tokens: Token[], startIndex: number, maxDepth: number): number => {
  for (let i = startIndex + 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (isHeading(token) && token.depth <= maxDepth) {
      return i;
    }
  }
  return tokens.length;
};

/**
 * Extract links from a section starting at an H2 heading.
 */
const extractSectionLinks = (tokens: Token[], sectionName: string): ParsedLink[] => {
  const startIndex = findH2Index(tokens, sectionName);
  if (startIndex === -1) {
    return [];
  }

  const endIndex = findNextHeadingIndex(tokens, startIndex, 2);
  const sectionTokens = tokens.slice(startIndex + 1, endIndex);

  const links: ParsedLink[] = [];
  for (const token of sectionTokens) {
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
 * Check if a section name matches (case-insensitive).
 */
const isSectionToRemove = (headingText: string, sectionNames: string[]): boolean =>
  sectionNames.some((name) => name.toLowerCase() === headingText.toLowerCase());

/**
 * Remove specified sections from tokens using AST manipulation.
 * Returns tokens with matching H2 sections removed.
 *
 * Uses the token AST rather than line-based regex, which correctly handles
 * edge cases like code blocks containing section headings.
 */
const removeSectionsFromTokens = (tokens: Token[], sectionNames: string[]): Token[] => {
  const result: Token[] = [];
  let skipUntilNextH2 = false;

  for (const token of tokens) {
    // Check if this is an H2 heading
    if (isHeading(token) && token.depth === 2) {
      if (isSectionToRemove(token.text, sectionNames)) {
        skipUntilNextH2 = true;
        continue;
      } else {
        skipUntilNextH2 = false;
      }
    }

    if (!skipUntilNextH2) {
      result.push(token);
    }
  }

  return result;
};

/**
 * Reconstruct markdown content from tokens using their raw property.
 * Each token contains the original markdown text in its `raw` property.
 */
const tokensToMarkdown = (tokens: Token[]): string => {
  const content = tokens.map((t) => t.raw).join('');
  return content.trim();
};

/**
 * Remove specified sections from markdown content using AST manipulation.
 * Returns content with `## Read First` and `## Read Next` sections removed.
 *
 * This approach parses to an AST first, which correctly handles edge cases
 * like code blocks that might contain text matching section headings.
 */
const removeSections = (content: string, sectionNames: string[]): string => {
  const lexer = new Lexer();
  const tokens = lexer.lex(content);
  const filteredTokens = removeSectionsFromTokens(tokens, sectionNames);
  return tokensToMarkdown(filteredTokens);
};

/**
 * Parse a leaf markdown file and extract related articles.
 *
 * Extracts links from `## Read First` and `## Read Next` sections,
 * and returns the main content with those sections removed.
 *
 * @example
 * parseLeafContent(`# Title
 *
 * Main content here.
 *
 * ## Read First
 *
 * - [Concepts](./concepts.md)
 *
 * ## Read Next
 *
 * - [Next Steps](./next.md)
 * `)
 * // => {
 * //   content: '# Title\n\nMain content here.',
 * //   related: {
 * //     readFirst: [{ label: 'Concepts', href: './concepts.md' }],
 * //     readNext: [{ label: 'Next Steps', href: './next.md' }]
 * //   }
 * // }
 */
export const parseLeafContent = (content: string): ParsedLeaf => {
  const lexer = new Lexer();
  const tokens = lexer.lex(content);

  const readFirst = extractSectionLinks(tokens, 'Read First');
  const readNext = extractSectionLinks(tokens, 'Read Next');

  const mainContent = removeSections(content, ['Read First', 'Read Next']);

  return {
    content: mainContent,
    related: {
      readFirst,
      readNext,
    },
  };
};

/**
 * Check if a parsed leaf has any related articles.
 *
 * @example
 * hasRelatedArticles({ content: '...', related: { readFirst: [], readNext: [] } })
 * // => false
 */
export const hasRelatedArticles = (parsed: ParsedLeaf): boolean =>
  parsed.related.readFirst.length > 0 || parsed.related.readNext.length > 0;

/**
 * Empty related articles object.
 */
export const emptyRelatedArticles: RelatedArticles = {
  readFirst: [],
  readNext: [],
};
