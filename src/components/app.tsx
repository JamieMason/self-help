import produce from 'immer';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Branch } from './branch';
import { getInitialState } from './lib/get-initial-state';
import { List } from './branch/list';
import { AppFrame } from './app-frame';
import { EditorApp } from './types';
import { writeLocalStorage } from './lib/local-storage';

export function App() {
  const [state, saveState] = useState<EditorApp.State>(getInitialState);
  const setState = useCallback<EditorApp.SetState>(
    (mutator) => saveState(produce(state, mutator)),
    [state]
  );

  useEffect(() => {
    document.documentElement.classList[state.darkModeEnabled ? 'add' : 'remove']('dark');
    writeLocalStorage('darkModeEnabled', state.darkModeEnabled);
  }, [state.darkModeEnabled]);

  return (
    <AppFrame setState={setState} state={state}>
      <List>
        <Branch path="doc" setState={setState} state={state} />
      </List>
    </AppFrame>
  );
}
