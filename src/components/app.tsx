import produce from 'immer';
import { useCallback, useState } from 'preact/hooks';
import { Branch } from './branch';
import { getInitialState } from './lib/get-initial-state';
import { List } from './branch/list';
import { AppFrame } from './app-frame';
import { EditorApp } from './types';

export function App() {
  const [state, saveState] = useState<EditorApp.State>(getInitialState);
  const setState = useCallback<EditorApp.SetState>(
    (mutator) => saveState(produce(state, mutator)),
    [state]
  );
  return (
    <AppFrame>
      <List>
        <Branch path="doc" setState={setState} state={state} />
      </List>
    </AppFrame>
  );
}
