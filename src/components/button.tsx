import { ComponentChildren, JSX } from 'preact';

interface Props {
  children: ComponentChildren;
  className?: string;
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ children, className, onClick }: Props): JSX.Element {
  return (
    <button
      className={className ? `field btn ${className}` : 'field btn'}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
