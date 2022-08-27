import get from 'lodash/get';
import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { LeafNode, Props } from './app';
import { DownButton } from './down-button';
import { LabelField } from './label-field';
import { moveNodeDown } from './lib/move-node-down';
import { moveNodeUp } from './lib/move-node-up';
import { removeNode } from './lib/remove-node';
import { RemoveButton } from './remove-button';
import { RowHeader } from './row-header';
import { ToggleButton } from './toggle-button';
import { UpButton } from './up-button';

export function Leaf({ path, setState, state }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const leaf: LeafNode = get(state, path);
  const { value, label } = leaf;

  return (
    <li>
      <RowHeader>
        <ToggleButton toggleIsOpen={toggleIsOpen} isOpen={isOpen} />
        <LabelField label={label} path={path} />
        <RemoveButton onClick={() => removeNode(setState, path)} />
        <UpButton onClick={() => moveNodeUp(setState, path)} />
        <DownButton onClick={() => moveNodeDown(setState, path)} />
      </RowHeader>
      {isOpen && <textarea className="block border w-full p-2 leaf mb-1">{value}</textarea>}
    </li>
  );
}
