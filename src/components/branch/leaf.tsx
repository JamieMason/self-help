import get from 'lodash/get';
import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { EditorApp } from '../types';
import { moveNodeDown } from './lib/move-node-down';
import { moveNodeUp } from './lib/move-node-up';
import { removeNode } from './lib/remove-node';
import { RowHeader } from './row-header';

interface Props {
  path: string;
  setState: EditorApp.SetState;
  state: EditorApp.State;
}

export function Leaf({ path, setState, state }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const leaf: EditorApp.LeafNode = get(state, path);
  const { value, label } = leaf;

  function onValueChange(e: any) {
    setState((next) => {
      get(next, path).value = e.currentTarget.value;
    });
  }

  function onInput(e: any) {
    const el = e.currentTarget;
    el.parentNode.dataset.replicatedValue = el.value;
  }

  return (
    <li>
      <RowHeader
        addChild={false}
        isOpen={isOpen}
        label={label}
        onMoveNodeDown={() => moveNodeDown(setState, path)}
        onMoveNodeUp={() => moveNodeUp(setState, path)}
        onRemoveNode={() => removeNode(setState, path)}
        path={path}
        setState={setState}
        toggleIsOpen={toggleIsOpen}
      />
      {isOpen && (
        <div className="grow-wrap">
          <textarea
            className="field textarea"
            onChange={onValueChange}
            onInput={onInput}
            value={value}
          />
        </div>
      )}
    </li>
  );
}
