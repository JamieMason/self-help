import * as marked from 'marked';
import * as TerminalRenderer from 'marked-terminal';
import * as prettier from 'prettier';
import { isBranch, isLeaf, isUnresolvedBranch, Node } from '../machine/tree/nodes';

marked.setOptions({
  renderer: new TerminalRenderer({
    reflowText: false,
    tab: 2,
  }),
});

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
  if (isUnresolvedBranch(node)) {
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

export const renderToCli = (markdown: string) =>
  marked(prettier.format(markdown, prettierrc)).trim();
