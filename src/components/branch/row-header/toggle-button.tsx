import { Button } from '../../button';
import chevronRightIcon from '../../../img/chevron-right.svg';

interface Props {
  toggleIsOpen: () => void;
  isOpen: boolean;
}

export function ToggleButton({ toggleIsOpen, isOpen }: Props) {
  return (
    <Button
      className="border-none btn-toggle invert dark:invert-0"
      onClick={toggleIsOpen}
    >
      <img
        alt={isOpen ? 'collapse' : 'expand'}
        className={`${isOpen ? ' rotate-90' : ''}`}
        height={20}
        src={chevronRightIcon}
        width={20}
      />
    </Button>
  );
}
