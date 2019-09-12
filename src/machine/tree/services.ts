import { MachineOptions } from 'xstate';
import { TreeContext, TreeEvent } from '.';
import { Branch } from '../..';
import { isAsyncBranch, isChildren } from './nodes';

export type TreeServices = MachineOptions<TreeContext, TreeEvent>['services'];

export const services: TreeServices = {
  getChildren: async ({ currentNode }): Promise<Branch> => {
    if (!isAsyncBranch(currentNode)) {
      throw new Error('getChildren invoked with a value not of type AsyncBranch');
    }
    const { label } = currentNode;
    const children = await currentNode.children();
    if (!isChildren(children)) {
      throw new Error(`AsyncBranch with label "${label}" has invalid children`);
    }
    return { children, label };
  },
};
