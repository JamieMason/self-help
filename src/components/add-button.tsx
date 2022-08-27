import { Button } from './button';

interface Props {
  onClick: () => void;
}

export function AddButton({ onClick }: Props) {
  return <Button onClick={onClick}>+</Button>;
}
