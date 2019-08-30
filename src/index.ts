import chalk from 'chalk';
import { prompt } from 'inquirer';
import { WriteStream } from 'tty';
import { renderToCli } from './lib/markdown';
import { TreeInterpreter } from './machine/tree';
import { Branch, isBranch, isLeaf, Leaf, Node } from './machine/tree/nodes';

interface Answer {
  name: string;
  short: string;
  value: number;
}

interface ChosenAnswer {
  childIndex: number;
}

const getChoices = (node: Branch): Answer[] =>
  node.children.map((child: Node, i) => ({
    name: child.label,
    short: ' ',
    value: i,
  }));

const stdout = process.stdout as WriteStream;
const LOADING_MESSAGE = '! Loading...';

export const selfHelp = async (interpreter: TreeInterpreter): Promise<void> => {
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
