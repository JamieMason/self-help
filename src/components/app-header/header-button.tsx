import { ComponentChildren } from 'preact';

export function HeaderButton({
  children,
  iconSrc,
  onClick,
}: {
  children: ComponentChildren;
  iconSrc: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex items-center px-3 py-2 bg-slate-800 text-sm leading-4 font-medium rounded-md text-white"
      onClick={onClick}
      type="button"
    >
      <img alt="" aria-hidden="true" className="h-5 w-5" height={10} src={iconSrc} width={10} />
      <span className="hidden md:inline ml-2">{children}</span>
    </button>
  );
}
