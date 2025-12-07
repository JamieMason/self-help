import { resolve } from 'path';
import { pathToFileURL } from 'url';
import type { Node } from './index.js';
import { toMarkdownFile } from './lib/markdown.js';
import { tryPanicAsync } from './lib/try-panic.js';

interface HelpDocumentSource {
  getHelpDocument: () => Node | Promise<Node>;
}

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const fileUrl = pathToFileURL(dataPath).href;
  const IMPORT_ERROR = `Failed to import('${dataPath}');`;
  const source = (await tryPanicAsync(() => import(fileUrl), IMPORT_ERROR)) as HelpDocumentSource;
  const GET_DOCUMENT_ERROR = `Failed to call getHelpDocument() from ${dataPath}`;
  const tree = (await tryPanicAsync(() => source.getHelpDocument(), GET_DOCUMENT_ERROR)) as Node;
  const markdown = await toMarkdownFile(tree);
  console.log(markdown);
};
