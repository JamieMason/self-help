import { assign, EventObject, MachineOptions } from 'xstate';
import { SelectChildEvent, TreeContext, TreeEvent } from './index';
import { isBranch, isNode } from './nodes';

export type TreeActions = MachineOptions<TreeContext, TreeEvent>['actions'];

const isSelectChildEvent = (event: TreeEvent): event is SelectChildEvent =>
  event.type === 'SELECT_CHILD';

export const actions: TreeActions = {
  selectChild: assign(({ currentNode }, event) => ({
    currentNode:
      isSelectChildEvent(event) &&
      isBranch(currentNode) &&
      isNode(currentNode.children[event.childIndex])
        ? currentNode.children[event.childIndex]
        : currentNode,
  })),
  selectRoot: assign((context) => ({ currentNode: context.rootNode })),
};
