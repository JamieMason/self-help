import { EditorApp } from '../../types';
import { AddButton } from './add-button';
import { DownButton } from './down-button';
import { LabelField } from './label-field';
import { RemoveButton } from './remove-button';
import { ToggleButton } from './toggle-button';
import { ToolTip } from './tool-tip';
import { UpButton } from './up-button';

interface Props {
  addChild: false | (() => void);
  isOpen: boolean;
  label: string;
  onMoveNodeDown: () => void;
  onMoveNodeUp: () => void;
  onRemoveNode: () => void;
  path: string;
  setState: EditorApp.SetState;
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
  setState,
  toggleIsOpen,
}: Props) {
  return (
    <div className="flex items-center mb-1 gap-x-1">
      <ToolTip label={isOpen ? 'collapse' : 'expand'} position="right">
        <ToggleButton toggleIsOpen={toggleIsOpen} isOpen={isOpen} />
      </ToolTip>
      <LabelField label={label} path={path} setState={setState} />
      {addChild && (
        <ToolTip label="Add a next step">
          <AddButton onClick={addChild} />
        </ToolTip>
      )}
      <ToolTip label="Delete step and its contents">
        <RemoveButton onClick={onRemoveNode} />
      </ToolTip>
      <ToolTip label="Move up">
        <UpButton onClick={onMoveNodeUp} />
      </ToolTip>
      <ToolTip label="Move down">
        <DownButton onClick={onMoveNodeDown} />
      </ToolTip>
    </div>
  );
}