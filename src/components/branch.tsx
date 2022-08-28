import { isNonEmptyArray } from 'expect-more/dist/is-non-empty-array';
import get from 'lodash/get';
import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { AddButton } from './add-button';
import { BranchNode, Node, Props } from './app';
import { DownButton } from './down-button';
import { LabelField } from './label-field';
import { Leaf } from './leaf';
import { isBranchNode } from './lib/is-branch-node';
import { isLeafNode } from './lib/is-leaf-node';
import { moveNodeDown } from './lib/move-node-down';
import { moveNodeUp } from './lib/move-node-up';
import { removeNode } from './lib/remove-node';
import { List } from './list';
import { RemoveButton } from './remove-button';
import { RowHeader } from './row-header';
import { ToggleButton } from './toggle-button';
import { UpButton } from './up-button';

export function Branch({ path, setState, state }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const branch: BranchNode = get(state, path);
  const { children, label } = branch;

  function addChild() {
    setIsOpen(true);
    setState((doc) => {
      const node: Node = get(doc, path);
      if (!isBranchNode(node)) throw new Error('node is not a BranchNode');
      node.children.unshift({ label: '', children: [] });
    });
  }

  return (
    <li>
      <RowHeader>
        <ToggleButton toggleIsOpen={toggleIsOpen} isOpen={isOpen} />
        <LabelField label={label} path={path} />
        <AddButton onClick={addChild} />
        <RemoveButton onClick={() => removeNode(setState, path)} />
        <UpButton onClick={() => moveNodeUp(setState, path)} />
        <DownButton onClick={() => moveNodeDown(setState, path)} />
      </RowHeader>
      {isOpen && isNonEmptyArray(children) && (
        <List>
          {children.map((node, i) =>
            isBranchNode(node) ? (
              <Branch
                key={node.label}
                path={`${path}.children.${i}`}
                setState={setState}
                state={state}
              />
            ) : isLeafNode(node) ? (
              <Leaf
                key={node.label}
                path={`${path}.children.${i}`}
                setState={setState}
                state={state}
              />
            ) : null
          )}
        </List>
      )}
    </li>
  );
}
