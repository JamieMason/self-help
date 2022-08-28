import { isNonEmptyArray } from 'expect-more/dist/is-non-empty-array';
import get from 'lodash/get';
import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { EditorApp } from '../types';
import { Leaf } from './leaf';
import { isBranchNode } from './lib/is-branch-node';
import { isLeafNode } from './lib/is-leaf-node';
import { moveNodeDown } from './lib/move-node-down';
import { moveNodeUp } from './lib/move-node-up';
import { removeNode } from './lib/remove-node';
import { List } from './list';
import { RowHeader } from './row-header';

interface Props {
  path: string;
  setState: EditorApp.SetState;
  state: EditorApp.State;
}

export function Branch({ path, setState, state }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const branch: EditorApp.BranchNode = get(state, path);
  const { children, label } = branch;

  function addChild() {
    setIsOpen(true);
    setState((next) => {
      const node: EditorApp.Node = get(next, path);
      if (!isBranchNode(node)) return;
      node.children.unshift({ label: '', children: [] });
    });
  }

  return (
    <li>
      <RowHeader
        addChild={addChild}
        isOpen={isOpen}
        label={label}
        onMoveNodeDown={() => moveNodeDown(setState, path)}
        onMoveNodeUp={() => moveNodeUp(setState, path)}
        onRemoveNode={() => removeNode(setState, path)}
        path={path}
        toggleIsOpen={toggleIsOpen}
      />
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
            ) : null,
          )}
        </List>
      )}
    </li>
  );
}
