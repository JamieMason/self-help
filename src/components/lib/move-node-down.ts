import get from 'lodash/get';
import { Node, SetState } from '../app';
import { isBranchNode } from './is-branch-node';

export function moveNodeDown(setState: SetState, path: string): void {
  setState((doc) => {
    const node: Node = get(doc, path);
    const parentNodePath = path.split('.').slice(0, -2).join('.');
    const parentNode: Node = get(doc, parentNodePath);
    if (!isBranchNode(parentNode)) throw new Error('parentNode is not a BranchNode');
    const children = parentNode.children;
    const i = Number(path.split('.').pop());
    if (i >= children.length - 1) return;
    children[i] = children[i + 1];
    children[i + 1] = node;
  });
}
