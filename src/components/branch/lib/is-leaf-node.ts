import { isNonEmptyString } from 'expect-more/dist/is-non-empty-string';
import { isObject } from 'expect-more/dist/is-object';
import { EditorApp } from '../../types';

export function isLeafNode(node: unknown): node is EditorApp.LeafNode {
  return isObject(node) && isNonEmptyString(node.value);
}
