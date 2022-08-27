import { Button } from './button';

interface Props {
  toggleIsOpen: () => void;
  isOpen: boolean;
}

export function ToggleButton({ toggleIsOpen, isOpen }: Props) {
  return <Button onClick={toggleIsOpen}>{isOpen ? '↓' : '→'}</Button>;
}
