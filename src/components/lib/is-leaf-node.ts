import { isNonEmptyString } from 'expect-more/dist/is-non-empty-string';
import { isObject } from 'expect-more/dist/is-object';
import { LeafNode } from '../app';

export function isLeafNode(node: unknown): node is LeafNode {
  return isObject(node) && isNonEmptyString(node.value);
}
