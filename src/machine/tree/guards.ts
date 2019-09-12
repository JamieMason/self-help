import { MachineOptions } from 'xstate';
import { TreeContext, TreeEvent } from '.';
import { isAsyncBranch, isBranch, isLeaf } from './nodes';

export type TreeGuards = MachineOptions<TreeContext, TreeEvent>['guards'];

export const guards: TreeGuards = {
  isAsyncBranch: (context) => isAsyncBranch(context.currentNode),
  isBranch: (context) => isBranch(context.currentNode),
  isLeaf: (context) => isLeaf(context.currentNode),
};
