import { resolve } from 'path';
import { toMarkdownFile } from './lib/markdown';

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const source = require(dataPath);
  const tree = await source.getData();
  const markdown = await toMarkdownFile(tree);
  console.log(markdown);
};
