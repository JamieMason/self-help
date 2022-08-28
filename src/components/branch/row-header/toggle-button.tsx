import { Button } from '../../button';

interface Props {
  toggleIsOpen: () => void;
  isOpen: boolean;
}

export function ToggleButton({ toggleIsOpen, isOpen }: Props) {
  return (
    <Button className="border-none" onClick={toggleIsOpen}>
      <i className={`block${isOpen ? ' rotate-90' : ''}`}>&#10148;</i>
    </Button>
  );
}
