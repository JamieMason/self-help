import { resolve } from 'path';
import { toMarkdownFile } from './lib/markdown';
import { tryPanic } from './lib/try-panic';

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const REQUIRE_ERROR = `Failed to require('${dataPath}');`;
  const source = tryPanic(() => require(dataPath), REQUIRE_ERROR);
  const GET_DOCUMENT_ERROR = `Failed to call getHelpDocument() from ${dataPath}`;
  const tree = await tryPanic(() => source.getHelpDocument(), GET_DOCUMENT_ERROR);
  const markdown = await toMarkdownFile(tree);
  console.log(markdown);
};
