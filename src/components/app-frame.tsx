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
    <main className="flex flex-col h-screen">
      <AppHeader setState={setState} state={state} />
      <div className="p-4 flex-1 overflow-auto relative">{children}</div>
    </main>
  );
}
