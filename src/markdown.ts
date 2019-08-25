import * as marked from 'marked';
import * as TerminalRenderer from 'marked-terminal';
import * as prettier from 'prettier';

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

export const renderMarkdown = (markdown: string) =>
  marked(prettier.format(markdown, prettierrc)).trim();
