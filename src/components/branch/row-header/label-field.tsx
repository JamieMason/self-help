import { useEffect } from 'preact/hooks';
import { EditorApp } from '../../types';
import get from 'lodash/get';
import { memo } from 'preact/compat';

interface Props {
  label: string;
  path: string;
  setState: EditorApp.SetState;
}

export const LabelField = memo(LabelFieldComponent, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label && prevProps.path === nextProps.path
  );
});

function LabelFieldComponent({ label, path, setState }: Props) {
  useEffect(() => {
    if (label === '') {
      document.getElementById(path)?.focus();
    }
  }, []);

  function onLabelChange(e: any) {
    setState((next) => {
      get(next, path).label = e.currentTarget.value;
    });
  }

  return (
    <input
      className="field input"
      id={path}
      onBlur={onLabelChange}
      type="text"
      value={label}
    />
  );
}
