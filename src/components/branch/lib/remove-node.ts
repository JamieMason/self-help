import get from 'lodash/get';
import { EditorApp } from '../../types';
import { isBranchNode } from './is-branch-node';

export function removeNode(setState: EditorApp.SetState, path: string) {
  setState((doc) => {
    const node: EditorApp.Node = get(doc, path);
    const parentNodePath = path.split('.').slice(0, -2).join('.');
    const parentNode: EditorApp.Node = get(doc, parentNodePath);
    if (!isBranchNode(parentNode)) throw new Error('parentNode is not a BranchNode');
    parentNode.children = parentNode.children.filter((child) => child !== node);
  });
}
