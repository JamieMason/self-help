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
      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={onClick}
      type="button"
    >
      <img
        alt=""
        aria-hidden="true"
        className="-ml-0.5 mr-2 h-5 w-5"
        height={10}
        src={iconSrc}
        width={10}
      />
      {children}
    </button>
  );
}
