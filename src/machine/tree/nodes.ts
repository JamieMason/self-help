import { get, isArray, isFunction, isString } from 'lodash';

export interface Leaf {
  label: string;
  value: string;
}

export interface Branch {
  children: Node[];
  label: string;
}

export interface UnresolvedBranch {
  children: () => Promise<Node[]>;
  label: string;
}

export type Node = Leaf | Branch | UnresolvedBranch;

const children = (value: any) => get(value, 'children');
const label = (value: any) => get(value, 'label');
const hasLabel = (value: any) => isString(label(value));

export const isLeaf = (value: any): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

export const isChildren = (value: any): value is Node[] =>
  isArray(value) && value.length > 0 && value.every(isNode);

export const isBranch = (value: any): value is Branch =>
  hasLabel(value) && isChildren(children(value));

export const isUnresolvedBranch = (value: any): value is UnresolvedBranch =>
  hasLabel(value) && isFunction(children(value));

export const isNode = (value: any): value is Node =>
  isLeaf(value) || isBranch(value) || isUnresolvedBranch(value);
