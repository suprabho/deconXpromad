'use client';

import type {
  BackgroundKind,
  CompositionConfig,
  ForegroundType,
  MidGraphic,
  PositionPreset,
  ScrimDirection,
  SizeScale,
} from '@/lib/composition/types';
import { POSITION_PRESETS, SIZE_PRESETS, SIZE_SCALES } from '@/lib/composition/types';
import { defaultForegroundContent } from '@/lib/composition/defaults';
import {
  AURA_OPTIONS,
  BACKGROUND_IMAGE_OPTIONS,
  FOREGROUND_OPTIONS,
  MID_GRAPHIC_OPTIONS,
  groupOptions,
} from '@/lib/composition/registry';
import {
  ColorField,
  GroupedSelect,
  Section,
  Segmented,
  SelectField,
  Slider,
  TextArea,
  TextField,
  Toggle,
} from './controls';
import { ForegroundContentEditor } from './ForegroundContentEditor';

const POSITION_OPTS = POSITION_PRESETS.map((p) => ({
  value: p,
  label: p.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));
const SCALE_OPTS = SIZE_SCALES.map((s) => ({ value: s, label: s }));
const KIND_OPTS: { value: BackgroundKind; label: string }[] = [
  { value: 'aura', label: 'Aura' },
  { value: 'image', label: 'Image' },
  { value: 'solid', label: 'Solid' },
];
const SCRIM_DIR_OPTS: { value: ScrimDirection; label: string }[] = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'radial', label: 'Radial' },
  { value: 'full', label: 'Full' },
];

export function Inspector({
  config,
  onChange,
}: {
  config: CompositionConfig;
  onChange: (c: CompositionConfig) => void;
}) {
  const patch = (p: Partial<CompositionConfig>) => onChange({ ...config, ...p });
  const setBackground = (p: Partial<CompositionConfig['background']>) =>
    patch({ background: { ...config.background, ...p } });
  const setScrim = (p: Partial<CompositionConfig['scrim']>) => patch({ scrim: { ...config.scrim, ...p } });
  const setForeground = (p: Partial<CompositionConfig['foreground']>) =>
    patch({ foreground: { ...config.foreground, ...p } });
  const setOverlay = (p: Partial<CompositionConfig['overlay']>) =>
    patch({ overlay: { ...config.overlay, ...p } });

  const bg = config.background;
  const auraSelectValue = AURA_OPTIONS.some((o) => o.slug === bg.auraSlug) ? (bg.auraSlug as string) : '';

  /* --------------------------- mid graphics --------------------------- */
  const setMid = (i: number, p: Partial<MidGraphic>) => {
    const midGraphics = config.midGraphics.slice();
    midGraphics[i] = { ...midGraphics[i], ...p };
    patch({ midGraphics });
  };
  const addMid = () =>
    patch({
      midGraphics: [
        ...config.midGraphics,
        {
          id: crypto.randomUUID(),
          src: MID_GRAPHIC_OPTIONS[0]?.src ?? '',
          position: 'center',
          size: 'M',
          opacity: 1,
        },
      ],
    });
  const removeMid = (i: number) => patch({ midGraphics: config.midGraphics.filter((_, j) => j !== i) });

  return (
    <div className="space-y-4">
      {/* 1 · Size */}
      <Section title="Canvas size">
        <SelectField
          label="Output preset"
          value={config.sizeId}
          onChange={(sizeId) => patch({ sizeId })}
          options={SIZE_PRESETS.map((s) => ({ value: s.id, label: s.label }))}
        />
      </Section>

      {/* 2 · Background */}
      <Section title="Background" subtitle="Aura animation, raster image, or a solid fill.">
        <Segmented label="Type" value={bg.kind} onChange={(kind) => setBackground({ kind })} options={KIND_OPTS} />

        {bg.kind === 'aura' && (
          <>
            <SelectField
              label="Catalogued aura"
              value={auraSelectValue}
              onChange={(slug) => slug && setBackground({ auraSlug: slug })}
              options={[{ value: '', label: '— custom (below) —' }, ...AURA_OPTIONS.map((o) => ({ value: o.slug, label: o.label }))]}
            />
            <TextField
              label="Aura slug or URL"
              value={bg.auraSlug ?? ''}
              mono
              placeholder="paste any aura.promad.design slug"
              hint="Any slug or full embed URL from aura.promad.design works."
              onChange={(auraSlug) => setBackground({ auraSlug })}
            />
          </>
        )}

        {bg.kind === 'image' && (
          <>
            <GroupedSelect
              label="Image"
              value={bg.imageSrc ?? ''}
              onChange={(imageSrc) => setBackground({ imageSrc })}
              placeholder="— select an image —"
              groups={groupOptions(BACKGROUND_IMAGE_OPTIONS)}
            />
            <Segmented
              label="Fit"
              value={bg.imageFit ?? 'cover'}
              onChange={(imageFit) => setBackground({ imageFit })}
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
              ]}
            />
          </>
        )}

        {bg.kind === 'solid' && (
          <ColorField label="Fill colour" value={bg.color ?? '#0D1B3E'} onChange={(color) => setBackground({ color })} />
        )}

        <Slider
          label="Scrim"
          value={config.scrim.amount}
          min={0}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(amount) => setScrim({ amount })}
        />
        {config.scrim.amount > 0 && (
          <>
            <SelectField
              label="Scrim direction"
              value={config.scrim.direction}
              onChange={(direction) => setScrim({ direction })}
              options={SCRIM_DIR_OPTS}
            />
            <ColorField label="Scrim colour" value={config.scrim.color ?? '#0D1B3E'} onChange={(color) => setScrim({ color })} />
          </>
        )}
      </Section>

      {/* 3 · Mid graphics */}
      <Section title="Mid-ground graphics" subtitle="Layer SVGs / images between background and foreground.">
        {config.midGraphics.length === 0 && <p className="text-xs text-muted">No graphics yet.</p>}
        {config.midGraphics.map((g, i) => (
          <div key={g.id} className="space-y-2 rounded-md border border-hair p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">Graphic {i + 1}</span>
              <button type="button" onClick={() => removeMid(i)} className="rounded border border-hair px-2 text-xs text-muted hover:text-risk-text">
                Remove
              </button>
            </div>
            <GroupedSelect label="Asset" value={g.src} onChange={(src) => setMid(i, { src })} groups={groupOptions(MID_GRAPHIC_OPTIONS)} />
            <SelectField label="Position" value={g.position} onChange={(position) => setMid(i, { position })} options={POSITION_OPTS} />
            <Segmented label="Size" value={g.size} onChange={(size) => setMid(i, { size })} options={SCALE_OPTS} />
            <Slider label="Opacity" value={g.opacity} format={(v) => `${Math.round(v * 100)}%`} onChange={(opacity) => setMid(i, { opacity })} />
          </div>
        ))}
        <button type="button" onClick={addMid} className="w-full rounded-md border border-dashed border-hair py-2 text-xs font-medium text-cobalt hover:bg-cobalt/5">
          + Add graphic
        </button>
      </Section>

      {/* 4 · Foreground */}
      <Section title="Foreground component" subtitle="One Deconflict UI component, with editable content.">
        <SelectField
          label="Component"
          value={config.foreground.content.type}
          onChange={(type: ForegroundType) => setForeground({ content: defaultForegroundContent(type) })}
          options={FOREGROUND_OPTIONS.map((o) => ({ value: o.type, label: o.label }))}
        />
        {config.foreground.content.type !== 'none' && (
          <>
            <SelectField label="Position" value={config.foreground.position} onChange={(position: PositionPreset) => setForeground({ position })} options={POSITION_OPTS} />
            <Segmented label="Size" value={config.foreground.size} onChange={(size: SizeScale) => setForeground({ size })} options={SCALE_OPTS} />
            <Toggle label="Frosted card behind" checked={!!config.foreground.card} onChange={(card) => setForeground({ card })} />
            <div className="border-t border-hair pt-3">
              <ForegroundContentEditor content={config.foreground.content} onChange={(content) => setForeground({ content })} />
            </div>
          </>
        )}
      </Section>

      {/* 5 · Overlay text */}
      <Section title="Overlay text">
        <TextField label="Badge / eyebrow" value={config.overlay.badge ?? ''} onChange={(badge) => setOverlay({ badge })} />
        <TextArea label="Title" value={config.overlay.title ?? ''} onChange={(title) => setOverlay({ title })} />
        <TextArea label="Subtitle" value={config.overlay.subtitle ?? ''} onChange={(subtitle) => setOverlay({ subtitle })} />
        <SelectField label="Position" value={config.overlay.position} onChange={(position: PositionPreset) => setOverlay({ position })} options={POSITION_OPTS} />
        <Segmented
          label="Align"
          value={config.overlay.align}
          onChange={(align) => setOverlay({ align })}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
        <Segmented label="Max width" value={config.overlay.maxWidthScale} onChange={(maxWidthScale: SizeScale) => setOverlay({ maxWidthScale })} options={SCALE_OPTS} />
        <ColorField label="Text colour" value={config.overlay.textColor} onChange={(textColor) => setOverlay({ textColor })} />
        <ColorField label="Accent" value={config.overlay.accent} onChange={(accent) => setOverlay({ accent })} />
      </Section>
    </div>
  );
}
