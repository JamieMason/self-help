import { useEffect } from 'preact/hooks';
import { EditorApp } from '../../types';
import get from 'lodash/get';

interface Props {
  label: string;
  path: string;
  setState: EditorApp.SetState;
}

export function LabelField({ label, path, setState }: Props) {
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
