import { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import downloadIcon from '../img/download.svg';
import newDocumentIcon from '../img/new-document.svg';
import uploadIcon from '../img/upload.svg';
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
      <header className="bg-white shadow dark:bg-gray-800 flex items-center gap-x-2 p-4 dark:text-gray-400">
        <h1 className="flex-1">Interactive Q&A Guide Editor</h1>
        <HeaderButton onClick={() => {}} iconSrc={newDocumentIcon}>
          Create New
        </HeaderButton>
        <HeaderButton onClick={() => {}} iconSrc={uploadIcon}>
          Import
        </HeaderButton>
        <HeaderButton onClick={() => {}} iconSrc={downloadIcon}>
          Export
        </HeaderButton>
        <ThemeButton
          darkModeEnabled={darkModeEnabled}
          toggleDarkModeEnabled={toggleDarkModeEnabled}
        />
      </header>
      <div className="p-2">{children}</div>
    </main>
  );
}
