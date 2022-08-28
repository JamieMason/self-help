import { ComponentChildren, JSX } from 'preact';

interface Props {
  children: ComponentChildren;
  className?: string;
}

export function List({ children, className }: Props): JSX.Element {
  return <ol className={`branch node ${className}`}>{children}</ol>;
}
