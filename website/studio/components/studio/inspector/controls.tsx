'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import { fileToImageSrc } from '@/lib/composition/upload';

export const inputCls =
  'w-full rounded-md border border-hair bg-white px-2.5 py-1.5 text-sm text-ink outline-none ' +
  'transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 placeholder:text-muted/60';

/** A titled inspector card. */
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
    <section className="rounded-xl border border-hair bg-white p-4">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

/** A labelled control row. */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
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

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
}) {
  return (
    <Field label={`${label} · ${format ? format(value) : value}`}>
      <input
        type="range"
        className="w-full accent-cobalt"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
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
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
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
      <span className="text-xs font-medium text-muted">{label}</span>
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
