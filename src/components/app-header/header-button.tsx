import { ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
  classNames?: string;
  iconSrc: string;
  isActive: boolean;
  onClick: () => void;
}

export function HeaderButton({
  children,
  classNames,
  iconSrc,
  isActive,
  onClick,
}: Props) {
  return (
    <button
      className={`${classNames} ${
        isActive ? 'cursor-default' : 'opacity-60'
      } inline-flex items-center px-3 py-2 bg-slate-800 text-white text-sm leading-4 font-medium`}
      onClick={onClick}
      type="button"
    >
      <img
        alt=""
        aria-hidden="true"
        className="h-5 w-5"
        height={10}
        src={iconSrc}
        width={10}
      />
      <span className="hidden md:inline ml-2">{children}</span>
    </button>
  );
}
