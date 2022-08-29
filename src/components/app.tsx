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
  const [undoStates, setUndoStates] = useState<EditorApp.State[]>([state]);

  const setState = useCallback<EditorApp.SetState>(
    (mutator) => {
      const nextState = produce(state, mutator);
      saveState(nextState);
      setUndoStates(undoStates.concat(nextState));
    },
    [undoStates, state],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };

    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo();
      }
    }

    function undo() {
      if (undoStates.length === 0) return;
      const [prevState] = undoStates.slice(-2);
      const nextUndoStates = undoStates.slice(0, -1);
      saveState(prevState);
      setUndoStates(nextUndoStates);
    }
  }, [undoStates, state]);

  useEffect(() => {
    const method = state.darkModeEnabled ? 'add' : 'remove';
    document.documentElement.classList[method]('dark');
    writeLocalStorage('darkModeEnabled', state.darkModeEnabled);
  }, [state.darkModeEnabled]);

  return (
    <AppFrame setState={setState} state={state}>
      {state.currentRoute === 'editor' && (
        <List>
          <Branch
            node={state.doc as EditorApp.BranchNode}
            path="doc"
            setState={setState}
          />
        </List>
      )}
      {state.currentRoute === 'source' && (
        <Source setState={setState} state={state} />
      )}
    </AppFrame>
  );
}
