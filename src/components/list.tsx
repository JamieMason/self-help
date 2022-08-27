import { ComponentChildren, JSX } from 'preact';

interface Props {
  children: ComponentChildren;
}

export function List({ children }: Props): JSX.Element {
  return <ol className="branch node">{children}</ol>;
}
