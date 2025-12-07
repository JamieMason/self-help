import { select } from '@inquirer/prompts';
import { resolve } from 'path';
import c from 'tinyrainbow';
import type { WriteStream } from 'tty';
import { pathToFileURL } from 'url';
import type { Branch, Leaf, Node } from './index.js';
import { renderToCli } from './lib/markdown.js';
import { tryPanicAsync } from './lib/try-panic.js';
import { createTreeInterpreter, type TreeActor, type TreeContext } from './machine/tree/index.js';
import { isBranch, isLeaf } from './machine/tree/nodes.js';

interface Choice {
  name: string;
  value: number;
}

interface HelpDocumentSource {
  getHelpDocument: () => Node | Promise<Node>;
}

const stdout = process.stdout as WriteStream;
const LOADING_MESSAGE = '! Loading...';

const getChoices = (node: Branch): Choice[] =>
  node.children.map((child: Node, i: number) => ({
    name: child.label,
    value: i,
  }));

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const fileUrl = pathToFileURL(dataPath).href;
  const IMPORT_ERROR = `Failed to import('${dataPath}');`;
  const source = (await tryPanicAsync(() => import(fileUrl), IMPORT_ERROR)) as HelpDocumentSource;
  const GET_DOCUMENT_ERROR = `Failed to call getHelpDocument() from ${dataPath}`;
  const tree = (await tryPanicAsync(() => source.getHelpDocument(), GET_DOCUMENT_ERROR)) as Node;
  const interpreter = createTreeInterpreter(tree);
  start(interpreter);
};

export const start = async (interpreter: TreeActor): Promise<void> => {
  let wasLoading = false;
  let promptPending = false;

  const renderChoice = (currentNode: Node) => {
    console.log(c.green('✔'), c.bold(currentNode.label));
  };

  const showLoadingStatus = (currentNode: Node) => {
    renderChoice(currentNode);
    stdout.write(c.yellow(LOADING_MESSAGE));
  };

  const hideLoadingStatus = () => {
    if (stdout.isTTY) {
      stdout.clearLine(0);
      stdout.moveCursor(-LOADING_MESSAGE.length, 0);
      stdout.moveCursor(0, -1);
      stdout.clearLine(0);
      stdout.write('');
    }
  };

  const listChildNodes = async (branch: Branch) => {
    if (promptPending) {
      return;
    }
    promptPending = true;

    try {
      const childIndex = await select<number>({
        message: branch.label,
        choices: getChoices(branch),
      });
      // Reset promptPending BEFORE sending the event to avoid race condition
      // where the state transition triggers a new subscription callback
      // while we're still inside this try block
      promptPending = false;
      interpreter.send({
        type: 'SELECT_CHILD',
        childIndex,
      });
    } catch (err) {
      promptPending = false;
      throw err;
    }
  };

  const renderValue = (leaf: Leaf) => {
    console.log('');
    console.log(renderToCli(leaf.value));
  };

  interpreter.subscribe((snapshot) => {
    const context = snapshot.context as TreeContext;
    const currentNode = context.currentNode;

    const isLoading = snapshot.matches({ resolveBranch: 'loading' });
    const isRenderBranch = snapshot.matches('renderBranch');
    const isRenderLeaf = snapshot.matches('renderLeaf');
    const isRenderValue = snapshot.matches('renderValue');

    // Handle loading state
    if (isLoading && !wasLoading) {
      wasLoading = true;
      showLoadingStatus(currentNode);
      return;
    }

    // Hide loading when we leave the loading state
    if (wasLoading && !isLoading) {
      wasLoading = false;
      hideLoadingStatus();
    }

    // Handle render states
    if (isRenderBranch && isBranch(currentNode)) {
      listChildNodes(currentNode);
    } else if (isRenderLeaf) {
      renderChoice(currentNode);
      interpreter.send({ type: 'FINALISE' });
    } else if (isRenderValue && isLeaf(currentNode)) {
      renderValue(currentNode);
    }
  });

  interpreter.start();
};
