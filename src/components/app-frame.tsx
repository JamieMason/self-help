import { ComponentChildren } from 'preact';
import { AppHeader } from './app-header';

interface Props {
  children: ComponentChildren;
}

export function AppFrame({ children }: Props) {
  return (
    <main>
      <AppHeader />
      <div className="p-4">{children}</div>
    </main>
  );
}
