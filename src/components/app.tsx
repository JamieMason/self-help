import produce from 'immer';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { AppFrame } from './app-frame';
import { Branch } from './branch';
import { List } from './branch/list';
import { getInitialState } from './lib/get-initial-state';
import { writeLocalStorage } from './lib/local-storage';
import { Source } from './source';
import { EditorApp } from './types';

export function App() {
  const [state, saveState] = useState<EditorApp.State>(getInitialState);
  const setState = useCallback<EditorApp.SetState>(
    (mutator) => saveState(produce(state, mutator)),
    [state],
  );

  useEffect(() => {
    document.documentElement.classList[
      state.darkModeEnabled ? 'add' : 'remove'
    ]('dark');
    writeLocalStorage('darkModeEnabled', state.darkModeEnabled);
  }, [state.darkModeEnabled]);

  return (
    <AppFrame setState={setState} state={state}>
      <List className={state.currentRoute === 'editor' ? '' : 'sr-only'}>
        <Branch path="doc" setState={setState} state={state} />
      </List>
      {state.currentRoute === 'source' && (
        <Source setState={setState} state={state} />
      )}
    </AppFrame>
  );
}
