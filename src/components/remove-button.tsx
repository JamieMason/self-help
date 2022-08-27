import { Button } from './button';

interface Props {
  onClick: () => void;
}

export function RemoveButton({ onClick }: Props) {
  return <Button onClick={onClick}>&times;</Button>;
}
