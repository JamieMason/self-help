import get from 'lodash/get';
import { EditorApp } from '../../types';
import { isBranchNode } from './is-branch-node';

export function moveNodeDown(setState: EditorApp.SetState, path: string): void {
  setState((next) => {
    const node: EditorApp.Node = get(next, path);
    const parentNodePath = path.split('.').slice(0, -2).join('.');
    const parentNode: EditorApp.Node = get(next, parentNodePath);
    if (!isBranchNode(parentNode))
      throw new Error('parentNode is not a BranchNode');
    const children = parentNode.children;
    const i = Number(path.split('.').pop());
    if (i >= children.length - 1) return;
    children[i] = children[i + 1];
    children[i + 1] = node;
  });
}
