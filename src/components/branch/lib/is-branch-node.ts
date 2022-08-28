import { isArray } from 'expect-more/dist/is-array';
import { isObject } from 'expect-more/dist/is-object';
import { BranchNode } from '../../app';
import { EditorApp } from '../../types';

export function isBranchNode(node: unknown): node is EditorApp.BranchNode {
  return isObject(node) && isArray(node.children);
}
