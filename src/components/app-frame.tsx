import { ComponentChildren } from 'preact';
import { AppHeader } from './app-header';
import { EditorApp } from './types';

interface Props {
  children: ComponentChildren;
  setState: EditorApp.SetState;
  state: EditorApp.State;
}

export function AppFrame({ children, setState, state }: Props) {
  return (
    <main>
      <AppHeader setState={setState} state={state} />
      <div className="p-4">{children}</div>
    </main>
  );
}
