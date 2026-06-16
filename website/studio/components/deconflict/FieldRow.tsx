import clsx from 'clsx';

export function FieldRow({
  label,
  children,
  highlighted = false,
}: {
  label: string;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-hair">
      <span className="text-sm text-muted">{label}</span>
      <div
        className={clsx(
          'flex min-h-9 items-center rounded-md px-3 text-sm',
          highlighted ? 'bg-field-bg border border-field-border' : 'bg-transparent'
        )}
      >
        {children}
      </div>
    </div>
  );
}
