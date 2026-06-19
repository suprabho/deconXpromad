'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import { fileToImageSrc } from '@/lib/composition/upload';

export const inputCls =
  'w-full rounded-md border border-hair bg-white px-2.5 py-1.5 text-[13px] text-ink outline-none ' +
  'transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 placeholder:text-muted/60';

/** A panel section — flat and full-bleed with a compact header, like Figma. */
export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-3 py-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-[11px] leading-snug text-muted">{subtitle}</p>}
      <div className="mt-2.5 space-y-2.5">{children}</div>
    </section>
  );
}

/**
 * A grouped block within a section — a hairline-ruled, lightly tinted card with a
 * small caps title and an optional trailing action, mirroring Figma's "Auto layout
 * / Appearance / Fill" sub-panels.
 */
export function SubSection({
  title,
  action,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-md bg-frost p-2.5">
      {(title || action) && (
        <div className="flex min-h-[18px] items-center justify-between">
          {title && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{title}</span>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/** A labelled control row. */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted/80">{hint}</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  mono,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        className={clsx(inputCls, mono && 'font-mono text-[12px]')}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <Field label={label}>
      <textarea
        className={clsx(inputCls, 'resize-none')}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        className={inputCls}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <Field label={label}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** A grouped <select> from { GroupName: options[] }. */
export function GroupedSelect({
  label,
  value,
  onChange,
  groups,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  groups: Record<string, { value: string; label: string }[]>;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {Object.entries(groups).map(([group, opts]) => (
          <optgroup key={group} label={group}>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </Field>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-1 rounded-md border border-hair bg-frost p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={clsx(
              'flex-1 rounded px-2 py-1 text-xs font-medium transition',
              value === o.value ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

/* -------------------------------- scrubber -------------------------------- */

const countDecimals = (step: number) => {
  if (!Number.isFinite(step) || Number.isInteger(step)) return 0;
  const s = String(step);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
};
const roundTo = (v: number, d: number) => {
  const f = 10 ** d;
  return Math.round(v * f) / f;
};
/** Clamp to [min,max] and snap to the nearest `step` from `min`. */
const snap = (v: number, min: number, max: number, step: number) => {
  const snapped = Math.round((v - min) / step) * step + min;
  return roundTo(Math.min(max, Math.max(min, snapped)), countDecimals(step) + 2);
};

/** The small dial whose pointer rotates with the value to invite "turning". */
function Knob({ t }: { t: number }) {
  const angle = -135 + Math.min(1, Math.max(0, t)) * 270;
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="shrink-0">
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
      <line
        x1="7"
        y1="7"
        x2="7"
        y2="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform={`rotate(${angle} 7 7)`}
      />
    </svg>
  );
}

/**
 * A numeric control that combines three affordances in one pill: a knob you drag
 * horizontally to scrub, a text input for precise entry, and a faint fill track
 * showing where the value sits in its range. `value` is stored raw; `displayScale`
 * + `unit` shape what the user reads/types (e.g. raw 0.7 shows as "70 %").
 */
export function Scrubber({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  unit = '',
  displayScale = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  displayScale?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const decimals = countDecimals(step * displayScale);
  const display = roundTo(value * displayScale, decimals);
  const shown = draft ?? String(display);
  const t = (max - min) === 0 ? 0 : (value - min) / (max - min);

  const commit = (raw: string) => {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) onChange(snap(n / displayScale, min, max, step));
    setDraft(null);
  };
  const bump = (deltaRaw: number) => {
    const next = snap(value + deltaRaw, min, max, step);
    onChange(next);
    setDraft(String(roundTo(next * displayScale, decimals)));
  };

  const startScrub = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startVal = value;
    const perPixel = (max - min || 1) / 200; // ~200px sweeps the full range
    const onMove = (ev: PointerEvent) => {
      const fine = ev.shiftKey ? 0.2 : 1;
      onChange(snap(startVal + (ev.clientX - startX) * perPixel * fine, min, max, step));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <Field label={label}>
      <div className="relative flex items-center gap-1.5 overflow-hidden rounded-md border border-hair bg-white pl-1.5 pr-2 py-1 transition focus-within:border-cobalt focus-within:ring-2 focus-within:ring-cobalt/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 bg-cobalt/10"
          style={{ width: `${Math.min(1, Math.max(0, t)) * 100}%` }}
        />
        <button
          type="button"
          onPointerDown={startScrub}
          aria-label={`Scrub ${label}`}
          className="relative z-10 grid h-5 w-5 cursor-ew-resize touch-none place-items-center rounded text-muted transition hover:text-cobalt"
        >
          <Knob t={t} />
        </button>
        <input
          className="relative z-10 w-full min-w-0 bg-transparent text-[13px] tabular-nums text-ink outline-none"
          value={shown}
          inputMode="decimal"
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => {
            setDraft(String(display));
            e.currentTarget.select();
          }}
          onBlur={() => commit(shown)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commit(e.currentTarget.value);
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setDraft(null);
              e.currentTarget.blur();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              bump(step * (e.shiftKey ? 10 : 1));
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              bump(-step * (e.shiftKey ? 10 : 1));
            }
          }}
        />
        {unit && <span className="relative z-10 shrink-0 text-[11px] text-muted">{unit}</span>}
      </div>
    </Field>
  );
}

/**
 * Deconflict Brand Color Guide v1.0 — the curated swatches every ColorField
 * surfaces beneath its inputs so picks stay on-palette. Mirrors the named
 * tokens in tailwind.config.ts (white is the field, navy the authority, cobalt
 * the single accent; green/amber/red are reserved status signals). Ordered
 * authority → accent → signal → neutral.
 */
export const BRAND_SWATCHES: readonly { name: string; hex: string }[] = [
  { name: 'Navy / Ink', hex: '#0D1B3E' },
  { name: 'Cobalt', hex: '#1A56DB' },
  { name: 'Cobalt Soft', hex: '#F0F4FF' },
  { name: 'Verified Green', hex: '#2F8F5C' },
  { name: 'Caution Amber', hex: '#A66A00' },
  { name: 'Alert Red', hex: '#B91C1C' },
  { name: 'Frost', hex: '#F4F6FB' },
  { name: 'Hair', hex: '#D6DCE8' },
  { name: 'Subtle', hex: '#B0B8CC' },
  { name: 'Muted', hex: '#6B7A99' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
];

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const current = value?.toUpperCase();
  return (
    // Not a bare <Field>: the swatch buttons sit OUTSIDE its <label> so a swatch
    // click doesn't get forwarded to the native colour input (popping it open).
    <div className="block">
      <Field label={label}>
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="h-8 w-10 shrink-0 cursor-pointer rounded border border-hair bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            className={clsx(inputCls, 'font-mono text-[12px] uppercase')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </Field>
      <div className="mt-1.5 flex flex-wrap gap-1" role="group" aria-label={`${label} brand swatches`}>
        {BRAND_SWATCHES.map((s) => (
          <button
            key={s.hex}
            type="button"
            title={`${s.name} · ${s.hex}`}
            aria-label={`${s.name} (${s.hex})`}
            onClick={() => onChange(s.hex)}
            className={clsx(
              'h-4 w-4 rounded-sm border transition',
              current === s.hex
                ? 'border-cobalt ring-2 ring-cobalt/30'
                : 'border-hair hover:scale-110',
            )}
            style={{ background: s.hex }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Upload your own image. Reads the file to a (downscaled) data URL and hands it
 * back via `onChange` — a data URL is a drop-in for any catalogue `src`, so it
 * renders in the preview, survives into the screenshot export, and is saved in
 * the composition JSON. Not built on `Field`: a hidden file <input> inside a
 * <label> would be re-triggered by the visible buttons.
 */
export function ImageUpload({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (src: string) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const uploaded = value.startsWith('data:');

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await fileToImageSrc(file));
    } catch {
      setErr('Could not read that image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted">{label}</span>
      <div className="flex items-center gap-2">
        {uploaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            aria-hidden
            className="h-9 w-9 shrink-0 rounded border border-hair bg-frost object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="flex-1 rounded-md border border-dashed border-hair px-2.5 py-1.5 text-xs font-medium text-cobalt transition hover:bg-cobalt/5 disabled:opacity-60"
        >
          {busy ? 'Reading…' : uploaded ? 'Replace upload' : 'Upload image…'}
        </button>
      </div>
      {err ? (
        <span className="mt-1 block text-[11px] text-risk-text">{err}</span>
      ) : (
        hint && <span className="mt-1 block text-[11px] text-muted/80">{hint}</span>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void pick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-hair bg-white px-2.5 py-1.5 text-sm text-ink"
    >
      <span className="text-[11px] font-medium text-muted">{label}</span>
      <span
        className={clsx(
          'relative h-5 w-9 rounded-full transition',
          checked ? 'bg-cobalt' : 'bg-hair',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition',
            checked ? 'left-[18px]' : 'left-0.5',
          )}
        />
      </span>
    </button>
  );
}
