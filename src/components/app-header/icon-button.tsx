interface Props {
  iconSrc: string;
  onClick: () => void;
}

export function IconButton({ iconSrc, onClick }: Props) {
  return (
    <button
      className="inline-flex items-center p-2 border border-slate-600 rounded-full bg-transparent"
      onClick={onClick}
      type="button"
    >
      <img
        alt=""
        className="inline w-5 h-5"
        src={iconSrc}
        width={10}
        height={10}
      />
    </button>
  );
}
