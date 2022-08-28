import get from 'lodash/get';
import { EditorApp } from '../../types';
import { isBranchNode } from './is-branch-node';

export function removeNode(setState: EditorApp.SetState, path: string) {
  setState((next) => {
    const node: EditorApp.Node = get(next, path);
    const parentNodePath = path.split('.').slice(0, -2).join('.');
    const parentNode: EditorApp.Node = get(next, parentNodePath);
    if (!isBranchNode(parentNode)) return;
    parentNode.children = parentNode.children.filter((child) => child !== node);
  });
}
