import { useEffect, useState } from 'preact/hooks';
import downloadIcon from '../../img/download.svg';
import newDocumentIcon from '../../img/new-document.svg';
import uploadIcon from '../../img/upload.svg';
import { GitHubButton } from './github-button';
import { HeaderButton } from './header-button';
import { ThemeButton } from './theme-button';

export function AppHeader() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.classList[darkModeEnabled ? 'add' : 'remove']('dark');
  }, [darkModeEnabled]);

  function toggleDarkModeEnabled() {
    return setDarkModeEnabled(!darkModeEnabled);
  }

  return (
    <header className="shadow bg-slate-900 flex items-center gap-x-2 p-4">
      <h1 className="flex-1">
        <code className="bg-black text-white p-2 rounded-sm">$ self-help</code>
        <span className="ml-2 text-white font-mono">Editor</span>
      </h1>
      <HeaderButton onClick={() => {}} iconSrc={newDocumentIcon}>
        Create New
      </HeaderButton>
      <HeaderButton onClick={() => {}} iconSrc={uploadIcon}>
        Import
      </HeaderButton>
      <HeaderButton onClick={() => {}} iconSrc={downloadIcon}>
        Export
      </HeaderButton>
      <GitHubButton />
      <ThemeButton
        darkModeEnabled={darkModeEnabled}
        toggleDarkModeEnabled={toggleDarkModeEnabled}
      />
    </header>
  );
}
