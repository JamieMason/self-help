import { assign, EventObject, MachineOptions } from 'xstate';
import { SelectChildEvent, TreeContext, TreeEvent } from './index';
import { isBranch, isNode } from './nodes';

export type TreeActions = MachineOptions<TreeContext, TreeEvent>['actions'];

export const actions: TreeActions = {
  incrementRetries: assign((context) => ({ retries: context.retries + 1 })),
  resetRetries: assign(() => ({ retries: 0 })),
  selectChild: assign<TreeContext, SelectChildEvent | EventObject>(
    ({ currentNode }, { childIndex: i }) => ({
      currentNode:
        isBranch(currentNode) && isNode(currentNode.children[i])
          ? currentNode.children[i]
          : currentNode,
    }),
  ),
  selectRoot: assign((context) => ({ currentNode: context.rootNode })),
};
