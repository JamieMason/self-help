import { Button } from '../../button';

interface Props {
  onClick: () => void;
}

export function DownButton({ onClick }: Props) {
  return <Button onClick={onClick}>↓</Button>;
}
