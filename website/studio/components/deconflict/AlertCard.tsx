import type { ReactNode } from 'react';
import {
  BankIcon,
  MapPinIcon,
  ShieldWarningIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import { FieldRow } from './FieldRow';
import { RiskPill } from './RiskPill';

/* -------------------------------------------------------------------------- *
 * AlertCard — a frosted "institution alert" panel: a pinned glass card with an
 * accent-coloured title + subtitle on the left, a configurable icon badge on
 * the right, and a stack of label/value field rows.
 *
 * Every icon is a prop — the header badge AND each field's leading glyph — so
 * the same card renders a financial-institution AML alert, a law-enforcement
 * notice, or any label/value summary just by swapping icons + accent. Reuses
 * FieldRow so rows line up exactly with CaseCard. Server-renderable.
 * -------------------------------------------------------------------------- */

export type AlertCardField = {
  label: string;
  /** Plain text is wrapped in ink; pass a node (RiskPill, mono span…) for more. */
  value: ReactNode;
  /** Configurable leading glyph for the row label. */
  icon?: ReactNode;
  /** Butter-yellow highlighted well (matched / emphasised fields). */
  highlighted?: boolean;
};

export function AlertCard({
  title,
  subtitle,
  icon,
  accentClassName = 'text-fi',
  fields,
  pin = true,
  className,
}: {
  title: string;
  subtitle?: string;
  /** Configurable header badge icon (top-right). */
  icon?: ReactNode;
  /** Tailwind text-colour class for the title. Defaults to the FI blue. */
  accentClassName?: string;
  fields: AlertCardField[];
  /** Red map-pin marker above the card; `true` for the default, or a node to override. */
  pin?: ReactNode | boolean;
  className?: string;
}) {
  return (
    <div className={clsx('relative', className)}>
      {pin && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2" aria-hidden>
          {pin === true ? (
            <MapPinIcon
              weight="fill"
              className="h-6 w-6 text-risk-text drop-shadow-[0_3px_6px_rgba(192,57,43,0.35)]"
            />
          ) : (
            pin
          )}
        </span>
      )}

      <article className="glass-surface glass-tint overflow-hidden rounded-xl border border-white/60 shadow-glass">
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div>
            <h3 className={clsx('text-base font-bold uppercase tracking-wide', accentClassName)}>
              {title}
            </h3>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {icon && (
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                         border border-white/60 bg-white/50 text-ink shadow-glass-chip backdrop-blur-sm"
            >
              {icon}
            </span>
          )}
        </header>

        {fields.map((field) => (
          <FieldRow
            key={field.label}
            label={field.label}
            icon={field.icon}
            highlighted={field.highlighted}
          >
            {typeof field.value === 'string' ? (
              <span className="text-ink">{field.value}</span>
            ) : (
              field.value
            )}
          </FieldRow>
        ))}
      </article>
    </div>
  );
}

/* -------------------------------------------------------------------------- *
 * Demo — the financial-institution AML alert from the reference. Drop
 * <AlertCardDemo /> into a page to see it; not needed in production.
 * -------------------------------------------------------------------------- */
export function AlertCardDemo() {
  return (
    <div className="flex min-h-[360px] items-center justify-center bg-frost p-12">
      <AlertCard
        className="w-full max-w-sm"
        title="Financial Institution Alert"
        subtitle="AML · Alert #2025-04112"
        icon={<BankIcon weight="duotone" className="h-5 w-5" />}
        fields={[
          {
            label: 'Subject Name',
            icon: <UserIcon weight="bold" className="h-4 w-4" />,
            value: 'John Doe',
          },
          {
            label: 'Wallet',
            icon: <WalletIcon weight="bold" className="h-4 w-4" />,
            highlighted: true,
            value: <span className="font-mono text-ink">0x7a3f…c10b</span>,
          },
          {
            label: 'Risk Tier',
            icon: <ShieldWarningIcon weight="bold" className="h-4 w-4" />,
            value: <RiskPill tier="High" />,
          },
        ]}
      />
    </div>
  );
}
