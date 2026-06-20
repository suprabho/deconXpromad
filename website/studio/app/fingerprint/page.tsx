'use client';

import { useMemo, useState } from 'react';
import {
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  DownloadSimpleIcon,
  FingerprintIcon,
  ImageIcon,
  ShuffleIcon,
} from '@phosphor-icons/react/dist/ssr';

import { Fingerprint } from '@/components/fingerprint/Fingerprint';
import {
  generateFingerprint,
  type FingerprintOptions,
  type FingerprintPattern,
} from '@/lib/fingerprint/generate';

/* ------------------------------- presets ---------------------------------- */

const COLORS = [
  { name: 'Promad', value: '#F35B22' },
  { name: 'Ink', value: '#111114' },
  { name: 'Slate', value: '#475569' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Sky', value: '#0EA5E9' },
];

const BACKGROUNDS: { name: string; value: string | null }[] = [
  { name: 'Transparent', value: null },
  { name: 'Paper', value: '#F7F7F5' },
  { name: 'Charcoal', value: '#0E0E10' },
  { name: 'Tint', value: '#FFF1EB' },
];

const PATTERNS: (FingerprintPattern | 'auto')[] = ['auto', 'whorl', 'loop', 'arch'];

const EXPORT_SIZE = 512;

/* ------------------------------- helpers ---------------------------------- */

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function svgToPngBlob(svg: string, size: number): Promise<Blob> {
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');
  ctx.drawImage(img, 0, 0, size, size);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  );
}

const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'fingerprint';

/* -------------------------------- page ------------------------------------ */

export default function FingerprintStudioPage() {
  const [seed, setSeed] = useState('hello@promad.design');
  const [pattern, setPattern] = useState<FingerprintPattern | 'auto'>('auto');
  const [density, setDensity] = useState(0.6);
  const [color, setColor] = useState(COLORS[0].value);
  const [background, setBackground] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [gallery, setGallery] = useState<string[]>(() =>
    ['promad', 'deconflict', 'aura', 'studio', 'case-0427', 'whorl', 'loop', 'arch'].slice(),
  );

  const options: FingerprintOptions = useMemo(
    () => ({ size: EXPORT_SIZE, color, background, pattern, density }),
    [color, background, pattern, density],
  );

  const result = useMemo(() => generateFingerprint(seed, options), [seed, options]);

  const copySvg = async () => {
    await navigator.clipboard.writeText(result.svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const downloadSvg = () => {
    download(new Blob([result.svg], { type: 'image/svg+xml' }), `${slug(seed)}.svg`);
  };

  const downloadPng = async () => {
    download(await svgToPngBlob(result.svg, EXPORT_SIZE), `${slug(seed)}.png`);
  };

  const shuffleGallery = () => setGallery(Array.from({ length: 8 }, randomSeed));

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* header */}
        <header className="mb-8 flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-neutral-900 text-white">
            <FingerprintIcon size={24} weight="regular" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Fingerprint Generator</h1>
            <p className="mt-0.5 text-sm text-neutral-500">
              Turn any seed into a unique, deterministic fingerprint. Same seed, same print —
              export to SVG or PNG.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* preview */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div
              className="relative mx-auto grid aspect-square w-full max-w-md place-items-center overflow-hidden rounded-xl"
              style={
                background
                  ? { background }
                  : {
                      backgroundImage:
                        'conic-gradient(#eaeaea 90deg, transparent 90deg 180deg, #eaeaea 180deg 270deg, transparent 270deg)',
                      backgroundSize: '20px 20px',
                    }
              }
            >
              <Fingerprint
                key={result.seed + result.pattern + color + density}
                seed={seed}
                {...options}
                background={null}
                className="h-full w-full p-6"
                title={`Fingerprint for ${seed}`}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-neutral-500">
                <span className="font-medium text-neutral-700">{result.pattern}</span> ·{' '}
                {result.meta.segmentCount} ridges
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copySvg}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                  {copied ? 'Copied' : 'Copy SVG'}
                </button>
                <button
                  onClick={downloadSvg}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  <DownloadSimpleIcon size={16} /> SVG
                </button>
                <button
                  onClick={downloadPng}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  <ImageIcon size={16} /> PNG
                </button>
              </div>
            </div>
          </section>

          {/* controls */}
          <aside className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <Field label="Seed">
              <div className="flex gap-2">
                <input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  spellCheck={false}
                  className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  placeholder="email, id, anything…"
                />
                <button
                  onClick={() => setSeed(randomSeed())}
                  title="Random seed"
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
                >
                  <ShuffleIcon size={16} />
                </button>
              </div>
            </Field>

            <Field label="Pattern">
              <div className="grid grid-cols-4 gap-1.5">
                {PATTERNS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPattern(p)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition ${
                      pattern === p
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`Density · ${Math.round(density * 100)}%`}>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.01}
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
            </Field>

            <Field label="Color">
              <div className="flex flex-wrap items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                    style={{ background: c.value }}
                    className={`size-7 rounded-full ring-offset-2 transition ${
                      color === c.value ? 'ring-2 ring-neutral-900' : 'ring-1 ring-black/10'
                    }`}
                  />
                ))}
                <label className="relative size-7 cursor-pointer overflow-hidden rounded-full ring-1 ring-black/10">
                  <span
                    className="absolute inset-0"
                    style={{
                      background:
                        'conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
                    }}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
              </div>
            </Field>

            <Field label="Background">
              <div className="grid grid-cols-4 gap-1.5">
                {BACKGROUNDS.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => setBackground(b.value)}
                    title={b.name}
                    className={`h-8 rounded-lg border text-[10px] font-medium transition ${
                      background === b.value
                        ? 'border-neutral-900 ring-1 ring-neutral-900'
                        : 'border-neutral-200'
                    }`}
                    style={
                      b.value
                        ? { background: b.value, color: b.value === '#0E0E10' ? '#fff' : '#555' }
                        : undefined
                    }
                  >
                    {b.value ? '' : 'None'}
                  </button>
                ))}
              </div>
            </Field>
          </aside>
        </div>

        {/* gallery */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-700">Variations</h2>
            <button
              onClick={shuffleGallery}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              <ArrowsClockwiseIcon size={14} /> Shuffle
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {gallery.map((g) => (
              <button
                key={g}
                onClick={() => setSeed(g)}
                title={g}
                className={`group aspect-square rounded-xl border bg-white p-2 transition hover:shadow-md ${
                  g === seed ? 'border-neutral-900' : 'border-neutral-200'
                }`}
              >
                <Fingerprint seed={g} size={120} color={color} className="h-full w-full" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </div>
      {children}
    </div>
  );
}
