import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import * as prettier from 'prettier';
import type { Node } from '..';
import { isAsyncBranch, isBranch, isLeaf } from '../machine/tree/nodes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
marked.use(markedTerminal() as any);

const prettierrc: prettier.Options = {
  parser: 'markdown',
  printWidth: 120,
  proseWrap: 'always',
  tabWidth: 2,
  useTabs: false,
};

const getNestedMarkdown = (children: Node[]): Promise<string> =>
  Promise.all(children.map(toMarkdownFile)).then((x) => x.join(''));

const ul = (html: string) => `<ul>${html}</ul>`;
const li = (html: string) => `<li>${html}</li>`;
const summary = (html: string) => `<summary>${html}</summary>`;
const details = (title: string, html: string) => `<details>${summary(title)}${ul(html)}</details>`;

export const toMarkdownFile = async (node: Node): Promise<string> => {
  if (isAsyncBranch(node)) {
    const children = await node.children();
    const contents = await getNestedMarkdown(children);
    return li(details(node.label, ul(contents)));
  } else if (isBranch(node)) {
    const children = node.children;
    const contents = await getNestedMarkdown(children);
    return li(details(node.label, ul(contents)));
  } else if (isLeaf(node)) {
    return li(details(node.label, ul(`\n\n${node.value}\n\n`)));
  }
  return '';
};

export const renderToCli = async (markdown: string): Promise<string> => {
  const formatted = await prettier.format(markdown, prettierrc);
  return marked.parse(formatted) as string;
};
