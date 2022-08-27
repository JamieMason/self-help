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

  return <input className="flex-1 border px-2" id={path} type="text" value={label} />;
}
