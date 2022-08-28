import { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import downloadIcon from '../img/download.svg';
import newDocumentIcon from '../img/new-document.svg';
import uploadIcon from '../img/upload.svg';
import { GitHubButton } from './github-button';
import { HeaderButton } from './header-button';
import { ThemeButton } from './theme-button';

interface Props {
  children: ComponentChildren;
}

export function AppFrame({ children }: Props) {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  function toggleDarkModeEnabled() {
    return setDarkModeEnabled(!darkModeEnabled);
  }

  useEffect(() => {
    document.documentElement.classList[darkModeEnabled ? 'add' : 'remove']('dark');
  }, [darkModeEnabled]);

  return (
    <main>
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
      <div className="p-4">{children}</div>
    </main>
  );
}
