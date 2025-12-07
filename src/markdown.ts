import { resolve } from 'path';
import type { Node } from '.';
import { toMarkdownFile } from './lib/markdown';
import { tryPanic } from './lib/try-panic';

interface HelpDocumentSource {
  getHelpDocument: () => Node | Promise<Node>;
}

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const REQUIRE_ERROR = `Failed to require('${dataPath}');`;
  const source = tryPanic(() => require(dataPath), REQUIRE_ERROR) as HelpDocumentSource;
  const GET_DOCUMENT_ERROR = `Failed to call getHelpDocument() from ${dataPath}`;
  const tree = (await tryPanic(() => source.getHelpDocument(), GET_DOCUMENT_ERROR)) as Node;
  const markdown = await toMarkdownFile(tree);
  console.log(markdown);
};
