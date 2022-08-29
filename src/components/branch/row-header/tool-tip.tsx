import { ComponentChildren } from 'preact';
import { memo } from 'preact/compat';

interface Props {
  children: ComponentChildren;
  label: string;
  position?: 'left' | 'right';
}

export const ToolTip = memo(ToolTipComponent, (prevProps, nextProps) => {
  return prevProps.label === nextProps.label;
});

function ToolTipComponent({ children, label, position = 'left' }: Props) {
  return (
    <div className={`tooltip tooltip--${position}`}>
      <i className="tooltip__bubble">{label}</i>
      {children}
    </div>
  );
}
