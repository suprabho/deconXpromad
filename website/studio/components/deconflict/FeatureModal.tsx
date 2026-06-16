'use client';

import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  ChartLineUpIcon,
  CurrencyDollarIcon,
  EyeIcon,
  FingerprintIcon,
  GearIcon,
  HandshakeIcon,
  LightningIcon,
  LinkSimpleIcon,
  LockIcon,
  PulseIcon,
  ShieldCheckIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import type { FeatureIconKey, FeatureModalData, FeatureTone } from '@/lib/composition/types';

/* -------------------------------------------------------------------------- *
 * A frosted-glass feature modal — a window-chrome panel with a row of
 * thin-stroke outline icons + text, designed to float over a coloured
 * background (the studio's purple stage). Two pieces:
 *
 *   FeaturePanel  — the glass card on its own (drop into any layout)
 *   FeatureModal  — FeaturePanel wrapped in an accessible dialog overlay
 *
 * Icons render light on translucent glass, so place this over a dark/colour
 * background. For a light surface, flip `tone` to "frost".
 * -------------------------------------------------------------------------- */

export type FeatureItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

/**
 * Maps the serialisable icon keys (stored in the composition) to rendered
 * Phosphor nodes. The studio stores `FeatureIconKey` strings; this is the one
 * place that turns them into thin-stroke glyphs.
 */
export const FEATURE_ICONS: Record<FeatureIconKey, ReactNode> = {
  'shield-check': <ShieldCheckIcon weight="light" className="h-full w-full" />,
  gear: <GearIcon weight="light" className="h-full w-full" />,
  handshake: <HandshakeIcon weight="light" className="h-full w-full" />,
  'currency-dollar': <CurrencyDollarIcon weight="light" className="h-full w-full" />,
  lock: <LockIcon weight="light" className="h-full w-full" />,
  fingerprint: <FingerprintIcon weight="light" className="h-full w-full" />,
  link: <LinkSimpleIcon weight="light" className="h-full w-full" />,
  pulse: <PulseIcon weight="light" className="h-full w-full" />,
  eye: <EyeIcon weight="light" className="h-full w-full" />,
  lightning: <LightningIcon weight="light" className="h-full w-full" />,
  chart: <ChartLineUpIcon weight="light" className="h-full w-full" />,
};

/** The four icons from the reference, ready to spread into `items`. */
export const FEATURE_ITEMS: FeatureItem[] = [
  {
    icon: <ShieldCheckIcon weight="light" className="h-full w-full" />,
    title: 'Verified',
    description: 'Every match is cryptographically confirmed before it surfaces.',
  },
  {
    icon: <GearIcon weight="light" className="h-full w-full" />,
    title: 'Automated',
    description: 'Overlap detection runs continuously — no manual cross-checks.',
  },
  {
    icon: <HandshakeIcon weight="light" className="h-full w-full" />,
    title: 'Trusted',
    description: 'Agencies stay in control of what each side can reveal.',
  },
  {
    icon: <CurrencyDollarIcon weight="light" className="h-full w-full" />,
    title: 'Settled',
    description: 'Financial trails reconcile the moment both records align.',
  },
];

type Tone = FeatureTone;

type PanelProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items?: FeatureItem[];
  /** "glass" = light icons on dark/colour bg; "frost" = ink icons on light. */
  tone?: Tone;
  /** Show the macOS-style three-dot title bar. */
  chrome?: boolean;
  /** When set, a close (×) button renders in the title bar. */
  onClose?: () => void;
  className?: string;
  headingId?: string;
};

const TONES: Record<
  Tone,
  { panel: string; rule: string; dot: string; icon: string; title: string; body: string; eyebrow: string; close: string }
> = {
  glass: {
    panel: 'border-white/25 bg-white/10 text-white',
    rule: 'border-white/15',
    dot: 'bg-white/40',
    icon: 'text-sky-100 drop-shadow-[0_0_14px_rgba(186,230,253,0.45)]',
    title: 'text-white',
    body: 'text-white/65',
    eyebrow: 'text-sky-200/80',
    close: 'text-white/60 hover:bg-white/15 hover:text-white',
  },
  frost: {
    panel: 'border-white/60 bg-white/70 text-ink',
    rule: 'border-hair/70',
    dot: 'bg-ink/15',
    icon: 'text-cobalt drop-shadow-[0_0_10px_rgba(26,86,219,0.18)]',
    title: 'text-ink',
    body: 'text-muted',
    eyebrow: 'text-cobalt/80',
    close: 'text-muted hover:bg-ink/5 hover:text-ink',
  },
};

export function FeaturePanel({
  eyebrow,
  heading,
  description,
  items = FEATURE_ITEMS,
  tone = 'glass',
  chrome = true,
  onClose,
  className,
  headingId,
}: PanelProps) {
  const t = TONES[tone];

  return (
    <div
      className={clsx(
        'w-full overflow-hidden rounded-2xl border shadow-glass backdrop-blur-2xl',
        t.panel,
        className
      )}
    >
      {chrome && (
        <div className={clsx('flex items-center gap-2 border-b px-5 py-4', t.rule)}>
          <span className={clsx('h-3 w-3 rounded-full', t.dot)} />
          <span className={clsx('h-3 w-3 rounded-full', t.dot)} />
          <span className={clsx('h-3 w-3 rounded-full', t.dot)} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={clsx(
                'ml-auto flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                t.close
              )}
            >
              <XIcon weight="bold" className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="px-7 py-8 sm:px-9 sm:py-10">
        {(eyebrow || heading || description) && (
          <header className="mx-auto mb-9 max-w-md text-center">
            {eyebrow && (
              <p className={clsx('text-xs font-semibold uppercase tracking-[0.18em]', t.eyebrow)}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 id={headingId} className={clsx('mt-2 text-2xl font-bold tracking-tight', t.title)}>
                {heading}
              </h2>
            )}
            {description && <p className={clsx('mt-3 text-sm leading-relaxed', t.body)}>{description}</p>}
          </header>
        )}

        <ul className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <span className={clsx('h-12 w-12', t.icon)} aria-hidden>
                {item.icon}
              </span>
              <h3 className={clsx('mt-4 text-sm font-semibold tracking-wide', t.title)}>
                {item.title}
              </h3>
              <p className={clsx('mt-1.5 text-xs leading-relaxed', t.body)}>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Studio adapter: renders a FeaturePanel from the serialisable composition data
 * (icon KEYS, not nodes). The icon→node resolution lives HERE, in this client
 * module, so the server-side /render route never has to index FEATURE_ICONS
 * across the client boundary (which would hand back a client-reference proxy).
 */
export function FeatureModalForeground({ data }: { data: FeatureModalData }) {
  const items: FeatureItem[] = data.items.map((it) => ({
    icon: FEATURE_ICONS[it.icon] ?? FEATURE_ICONS['shield-check'],
    title: it.title,
    description: it.description,
  }));
  return (
    <FeaturePanel
      tone={data.tone}
      chrome={data.chrome}
      eyebrow={data.eyebrow || undefined}
      heading={data.heading || undefined}
      description={data.description || undefined}
      items={items}
    />
  );
}

type ModalProps = Omit<PanelProps, 'onClose' | 'headingId'> & {
  open: boolean;
  onClose: () => void;
  /** Close when the backdrop is clicked. Default true. */
  dismissable?: boolean;
};

export function FeatureModal({ open, onClose, dismissable = true, ...panel }: ModalProps) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, focus the panel on open, and lock background scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm
                 motion-safe:animate-fade-in"
      onClick={dismissable ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={panel.heading ? headingId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl outline-none motion-safe:animate-pop-in"
      >
        <FeaturePanel {...panel} headingId={headingId} onClose={onClose} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- *
 * Preview — the panel on the studio's purple stage with the orange light
 * streak + a ghost panel behind it, matching the reference frame. Drop
 * <FeatureModalDemo /> into a page to see it; not needed in production.
 * -------------------------------------------------------------------------- */
export function FeatureModalDemo() {
  return (
    <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#3b3a6b] via-[#34335f] to-[#1f2147] p-12">
      {/* warm light arc sweeping behind the glass */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 h-40 bg-[radial-gradient(60%_120%_at_50%_100%,rgba(232,148,31,0.55),transparent_70%)] blur-2xl" />
      {/* ghost panel offset behind for depth */}
      <div className="absolute h-[60%] w-[78%] translate-x-10 translate-y-8 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md" />
      <FeaturePanel
        className="relative z-10"
        eyebrow="Why Deconflict"
        heading="One signal, four guarantees"
        description="Each case overlap is verified, automated, governed, and reconciled — end to end."
      />
    </div>
  );
}
