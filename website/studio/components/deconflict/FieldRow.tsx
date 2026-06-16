import clsx from 'clsx';

export function FieldRow({
  label,
  children,
  icon,
  highlighted = false,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-hair/70 px-5 py-3.5">
      <span className="flex items-center gap-2 text-sm text-muted">
        {icon && <span className="text-muted/80">{icon}</span>}
        {label}
      </span>
      <div
        className={clsx(
          'flex min-h-9 items-center rounded-md px-3 text-sm',
          highlighted
            ? 'border border-field-border/70 bg-field-bg/70 shadow-field-inset backdrop-blur-sm'
            : 'bg-transparent'
        )}
      >
        {children}
      </div>
    </div>
  );
}
