import { ComponentChildren } from 'preact';
import { memo } from 'preact/compat';

interface Props {
  children: ComponentChildren;
  className?: string;
  label: string;
  position?: 'left' | 'right';
}

export const ToolTip = memo(ToolTipComponent, (prevProps, nextProps) => {
  return prevProps.label === nextProps.label;
});

function ToolTipComponent({
  children,
  className,
  label,
  position = 'left',
}: Props) {
  return (
    <div
      className={`tooltip tooltip--${position} flex items-center ${className}`}
    >
      <i className="tooltip__bubble">{label}</i>
      {children}
    </div>
  );
}
