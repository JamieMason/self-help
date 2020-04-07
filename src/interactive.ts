import * as chalk from 'chalk';
import { prompt } from 'inquirer';
import { resolve } from 'path';
import { WriteStream } from 'tty';
import { Branch, Leaf, Node } from '.';
import { renderToCli } from './lib/markdown';
import { tryPanic } from './lib/try-panic';
import { createTreeInterpreter, TreeInterpreter } from './machine/tree';
import { isBranch, isLeaf } from './machine/tree/nodes';

interface Answer {
  name: string;
  short: string;
  value: number;
}

interface ChosenAnswer {
  childIndex: number;
}

const stdout = process.stdout as WriteStream;
const LOADING_MESSAGE = '! Loading...';

const getChoices = (node: Branch): Answer[] =>
  node.children.map((child: Node, i) => ({
    name: child.label,
    short: ' ',
    value: i,
  }));

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const REQUIRE_ERROR = `Failed to require('${dataPath}');`;
  const source = tryPanic(() => require(dataPath), REQUIRE_ERROR);
  const GET_DOCUMENT_ERROR = `Failed to call getHelpDocument() from ${dataPath}`;
  const tree = await tryPanic(() => source.getHelpDocument(), GET_DOCUMENT_ERROR);
  const interpreter = createTreeInterpreter(tree);
  start(interpreter);
};

export const start = async (interpreter: TreeInterpreter): Promise<void> => {
  const renderChoice = (currentNode: Node) => {
    console.log(chalk.green('?'), chalk.bold(currentNode.label));
  };

  const showLoadingStatus = (currentNode: Node) => {
    renderChoice(currentNode);
    stdout.write(chalk.yellow(LOADING_MESSAGE));
  };

  const hideLoadingStatus = () => {
    stdout.clearLine(0);
    stdout.moveCursor(-LOADING_MESSAGE.length, 0);
    stdout.moveCursor(0, -1);
    stdout.clearLine(0);
    stdout.write('');
  };

  const listChildNodes = async (branch: Branch) => {
    const { childIndex } = await prompt<ChosenAnswer>({
      choices: getChoices(branch),
      message: branch.label,
      name: 'childIndex',
      type: 'list',
    });
    interpreter.send({
      type: 'SELECT_CHILD',
      childIndex,
    });
  };

  const renderValue = async (leaf: Leaf) => {
    console.log('');
    console.log(renderToCli(leaf.value));
  };

  interpreter.onTransition(async ({ context: { currentNode }, event, matches }) => {
    if (matches({ resolveBranch: 'loading' })) {
      showLoadingStatus(currentNode);
    } else if (event.type === 'done.invoke.getChildren') {
      hideLoadingStatus();
    }
    if (matches('renderBranch') && isBranch(currentNode)) {
      await listChildNodes(currentNode);
    } else if (matches('renderLeaf')) {
      renderChoice(currentNode);
      interpreter.send({ type: 'FINALISE' });
    } else if (matches('renderValue') && isLeaf(currentNode)) {
      await renderValue(currentNode);
    }
  });

  interpreter.start();
};
