import { isNonEmptyArray } from 'expect-more/dist/is-non-empty-array';
import get from 'lodash/get';
import { memo } from 'preact/compat';
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
  node: EditorApp.BranchNode;
  path: string;
  setState: EditorApp.SetState;
}

export const Branch = memo(BranchComponent, (prevProps, nextProps) => {
  return prevProps.node === nextProps.node;
});

function BranchComponent({ node, path, setState }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const { children, label } = node;

  function addChild() {
    setIsOpen(true);
    setState((next) => {
      const nextNode: EditorApp.Node = get(next, path);
      if (!isBranchNode(nextNode)) return;
      nextNode.children.unshift({ label: '', children: [] });
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
        setState={setState}
        toggleIsOpen={toggleIsOpen}
      />
      {isNonEmptyArray(children) && (
        <List className={!isOpen ? 'hidden' : undefined}>
          {children.map((child, i) =>
            isBranchNode(child) ? (
              <Branch
                key={child.label}
                node={child}
                path={`${path}.children.${i}`}
                setState={setState}
              />
            ) : isLeafNode(child) ? (
              <Leaf
                key={child.label}
                node={child}
                path={`${path}.children.${i}`}
                setState={setState}
              />
            ) : null,
          )}
        </List>
      )}
    </li>
  );
}
