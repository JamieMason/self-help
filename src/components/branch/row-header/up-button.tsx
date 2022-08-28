import { Button } from '../../button';

interface Props {
  onClick: () => void;
}

export function UpButton({ onClick }: Props) {
  return <Button onClick={onClick}>↑</Button>;
}
