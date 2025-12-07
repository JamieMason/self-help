import { get, isArray, isFunction, isString } from 'lodash';
import type { AsyncBranch, Branch, Leaf, Node } from '../../';

const children = (value: unknown) => get(value, 'children');
const label = (value: unknown) => get(value, 'label');
const hasLabel = (value: unknown) => isString(label(value));

export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

export const isChildren = (value: unknown): value is Node[] =>
  isArray(value) && value.length > 0 && value.every(isNode);

export const isBranch = (value: unknown): value is Branch =>
  hasLabel(value) && isChildren(children(value));

export const isAsyncBranch = (value: unknown): value is AsyncBranch =>
  hasLabel(value) && isFunction(children(value));

export const isNode = (value: unknown): value is Node =>
  isLeaf(value) || isBranch(value) || isAsyncBranch(value);
