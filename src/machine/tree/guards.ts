import { MachineOptions } from 'xstate';
import { TreeContext, TreeEvent } from '.';
import { isBranch, isLeaf, isUnresolvedBranch } from './nodes';

export type TreeGuards = MachineOptions<TreeContext, TreeEvent>['guards'];

export const guards: TreeGuards = {
  isUnresolvedBranch: (context) => isUnresolvedBranch(context.currentNode),
  isBranch: (context) => isBranch(context.currentNode),
  isLeaf: (context) => isLeaf(context.currentNode),
};
