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
      const doc = JSON.parse(e.currentTarget.value);
      setHasError(false);
      setState((next) => {
        next.doc = doc;
      });
    } catch (err) {
      setHasError(true);
    }
  }

  return (
    <textarea
      className={`field textarea absolute inset-0${
        hasError ? ' border border-red-600 text-red-600' : ''
      }`}
      onBlur={onChange}
      onFocus={() => setHasError(false)}
      value={JSON.stringify(state.doc, null, 2)}
    />
  );
}
