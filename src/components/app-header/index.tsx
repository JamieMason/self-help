import codeIcon from '../../img/code.svg';
import editIcon from '../../img/edit.svg';
import { EditorApp } from '../types';
import { GitHubButton } from './github-button';
import { HeaderButton } from './header-button';
import { ThemeButton } from './theme-button';

interface Props {
  setState: EditorApp.SetState;
  state: EditorApp.State;
}

export function AppHeader({ setState, state }: Props) {
  function toggleDarkModeEnabled() {
    setState((next) => {
      next.darkModeEnabled = !next.darkModeEnabled;
    });
  }

  function createFile() {
    setState((next) => {
      next.doc = {
        label: '',
        children: [],
      };
    });
  }

  function importFile() {}

  return (
    <header className="shadow bg-slate-900 flex items-center gap-x-2 p-4">
      <h1 className="bg-black text-white p-2 rounded-sm font-mono">
        $ self-help
      </h1>
      <div className="flex-1 flex justify-center">
        <HeaderButton
          classNames="rounded-l-md mr-px"
          iconSrc={editIcon}
          isActive={state.currentRoute === 'editor'}
          onClick={() =>
            setState((next) => {
              next.currentRoute = 'editor';
            })
          }
        >
          Editor
        </HeaderButton>
        <HeaderButton
          classNames="rounded-r-md"
          iconSrc={codeIcon}
          isActive={state.currentRoute === 'source'}
          onClick={() =>
            setState((next) => {
              next.currentRoute = 'source';
            })
          }
        >
          Source
        </HeaderButton>
      </div>
      <GitHubButton />
      <ThemeButton
        darkModeEnabled={state.darkModeEnabled}
        toggleDarkModeEnabled={toggleDarkModeEnabled}
      />
    </header>
  );
}
