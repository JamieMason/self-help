import { useEffect } from 'preact/hooks';

interface Props {
  label: string;
  path: string;
}

export function LabelField({ label, path }: Props) {
  useEffect(() => {
    if (label === '') {
      document.getElementById(path)?.focus();
    }
  }, []);

  return <input className="field input" id={path} type="text" value={label} />;
}
