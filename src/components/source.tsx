import { useState } from 'preact/hooks';
import { EditorApp } from './types';

interface Props {
  setState: EditorApp.SetState;
  state: EditorApp.State;
}

export function Source({ setState, state }: Props): JSX.Element {
  const [hasError, setHasError] = useState(false);

  function onChange(e: any) {
    try {
      const doc = JSON.parse(e.currentTarget.innerHTML);
      setHasError(false);
      setState((next) => {
        next.doc = doc;
      });
    } catch (err) {
      setHasError(true);
    }
  }

  return (
    <pre
      className={`text-sm p-2${
        hasError ? ' border border-red-600 text-red-600' : ''
      }`}
      contentEditable
      onBlur={onChange}
      onFocus={() => setHasError(false)}
    >
      {JSON.stringify(state.doc, null, 2)}
    </pre>
  );
}

function isValid(value: string): boolean {
  try {
    const doc = JSON.parse(value);
    return true;
  } catch (err) {
    return false;
  }
}
