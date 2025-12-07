import type { AsyncBranch, AsyncLeaf, Branch, Leaf, Node } from '../../index.js';
import { get, isArray, isFunction, isString } from '../../lib/utils.js';

const children = (value: unknown) => get(value, 'children');
const label = (value: unknown) => get(value, 'label');
const hasLabel = (value: unknown) => isString(label(value));

export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

export const isAsyncLeaf = (value: unknown): value is AsyncLeaf =>
  hasLabel(value) && isFunction(get(value, 'value'));

export const isChildren = (value: unknown): value is Node[] =>
  isArray(value) && value.length > 0 && value.every(isNode);

export const isBranch = (value: unknown): value is Branch =>
  hasLabel(value) && isChildren(children(value));

export const isAsyncBranch = (value: unknown): value is AsyncBranch =>
  hasLabel(value) && isFunction(children(value));

export const isNode = (value: unknown): value is Node =>
  isLeaf(value) || isAsyncLeaf(value) || isBranch(value) || isAsyncBranch(value);
