import { AddButton } from './add-button';
import { DownButton } from './down-button';
import { LabelField } from './label-field';
import { RemoveButton } from './remove-button';
import { ToggleButton } from './toggle-button';
import { UpButton } from './up-button';

interface Props {
  addChild: false | (() => void);
  isOpen: boolean;
  label: string;
  onMoveNodeDown: () => void;
  onMoveNodeUp: () => void;
  onRemoveNode: () => void;
  path: string;
  toggleIsOpen: () => void;
}

export function RowHeader({
  addChild,
  isOpen,
  label,
  onMoveNodeDown,
  onMoveNodeUp,
  onRemoveNode,
  path,
  toggleIsOpen,
}: Props) {
  return (
    <div className="flex items-center mb-1 gap-x-1">
      <ToggleButton toggleIsOpen={toggleIsOpen} isOpen={isOpen} />
      <LabelField label={label} path={path} />
      {addChild && <AddButton onClick={addChild} />}
      <RemoveButton onClick={onRemoveNode} />
      <UpButton onClick={onMoveNodeUp} />
      <DownButton onClick={onMoveNodeDown} />
    </div>
  );
}
