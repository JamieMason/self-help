import { ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
  label: string;
  position?: 'left' | 'right';
}

export function ToolTip({ children, label, position = 'left' }: Props) {
  return (
    <div className={`tooltip tooltip--${position}`}>
      <i className="tooltip__bubble">{label}</i>
      {children}
    </div>
  );
}
