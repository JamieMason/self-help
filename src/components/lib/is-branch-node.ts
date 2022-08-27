import { isArray } from 'expect-more/dist/is-array';
import { isObject } from 'expect-more/dist/is-object';
import { BranchNode } from '../app';

export function isBranchNode(node: unknown): node is BranchNode {
  return isObject(node) && isArray(node.children);
}
