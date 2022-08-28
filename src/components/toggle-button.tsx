import { Button } from './button';

interface Props {
  toggleIsOpen: () => void;
  isOpen: boolean;
}

export function ToggleButton({ toggleIsOpen, isOpen }: Props) {
  return (
    <Button onClick={toggleIsOpen}>
      <i className={isOpen ? 'rotate-90' : undefined}>&#10148;</i>
    </Button>
  );
}
