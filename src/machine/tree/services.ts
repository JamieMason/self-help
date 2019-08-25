import { MachineOptions } from 'xstate';
import { TreeContext, TreeEvent } from '.';
import { Branch, isChildren, isUnresolvedBranch } from './nodes';

export type TreeServices = MachineOptions<TreeContext, TreeEvent>['services'];

export const services: TreeServices = {
  getChildren: async ({ currentNode }): Promise<Branch> => {
    if (!isUnresolvedBranch(currentNode)) {
      throw new Error('getChildren invoked with a value not of type UnresolvedBranch');
    }
    const { label } = currentNode;
    const children = await currentNode.children();
    if (!isChildren(children)) {
      throw new Error(`UnresolvedBranch with label "${label}" has invalid children`);
    }
    return { children, label };
  },
};
