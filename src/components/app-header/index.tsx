import downloadIcon from '../../img/download.svg';
import newDocumentIcon from '../../img/new-document.svg';
import uploadIcon from '../../img/upload.svg';
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

  function exportFile() {}

  return (
    <header className="shadow bg-slate-900 flex items-center gap-x-2 p-4">
      <h1 className="flex-1">
        <code className="bg-black text-white p-2 rounded-sm">$ self-help</code>
        <span className="ml-2 text-white font-mono">Editor</span>
      </h1>
      <HeaderButton onClick={createFile} iconSrc={newDocumentIcon}>
        Create New
      </HeaderButton>
      <HeaderButton onClick={importFile} iconSrc={uploadIcon}>
        Import
      </HeaderButton>
      <HeaderButton onClick={exportFile} iconSrc={downloadIcon}>
        Export
      </HeaderButton>
      <GitHubButton />
      <ThemeButton
        darkModeEnabled={state.darkModeEnabled}
        toggleDarkModeEnabled={toggleDarkModeEnabled}
      />
    </header>
  );
}
