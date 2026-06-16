'use client';

import type {
  BackgroundKind,
  CompositionConfig,
  ForegroundElement,
  ForegroundType,
  MidGraphic,
  PositionPreset,
  ScrimDirection,
  SizeScale,
  Transform,
} from '@/lib/composition/types';
import { POSITION_PRESETS, SIZE_PRESETS, SIZE_SCALES } from '@/lib/composition/types';
import { defaultForegroundContent, defaultForegroundElement } from '@/lib/composition/defaults';
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
  ImageUpload,
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

/** Position / scale / 3-D rotation controls for one foreground element. */
function ElementTransformFields({
  transform: t,
  onChange,
}: {
  transform: Transform;
  onChange: (p: Partial<Transform>) => void;
}) {
  const has3D = t.rotateX !== 0 || t.rotateY !== 0;
  return (
    <div className="space-y-2 rounded-md bg-frost p-2">
      <div className="grid grid-cols-2 gap-x-3">
        <Slider label="Pos X" value={t.x} min={-25} max={125} step={0.5} format={(v) => `${Math.round(v)}%`} onChange={(x) => onChange({ x })} />
        <Slider label="Pos Y" value={t.y} min={-25} max={125} step={0.5} format={(v) => `${Math.round(v)}%`} onChange={(y) => onChange({ y })} />
      </div>
      <Slider label="Scale" value={t.scale} min={0.1} max={1.4} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(scale) => onChange({ scale })} />
      <div className="grid grid-cols-3 gap-x-3">
        <Slider label="Rot X" value={t.rotateX} min={-180} max={180} step={1} format={(v) => `${Math.round(v)}°`} onChange={(rotateX) => onChange({ rotateX })} />
        <Slider label="Rot Y" value={t.rotateY} min={-180} max={180} step={1} format={(v) => `${Math.round(v)}°`} onChange={(rotateY) => onChange({ rotateY })} />
        <Slider label="Rot Z" value={t.rotateZ} min={-180} max={180} step={1} format={(v) => `${Math.round(v)}°`} onChange={(rotateZ) => onChange({ rotateZ })} />
      </div>
      {has3D && (
        <Slider label="Perspective" value={t.perspective} min={200} max={3000} step={50} format={(v) => `${Math.round(v)}px`} onChange={(perspective) => onChange({ perspective })} />
      )}
    </div>
  );
}

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

  /* ------------------------ foreground elements ------------------------ */
  const setElement = (i: number, p: Partial<ForegroundElement>) => {
    const foreground = config.foreground.slice();
    foreground[i] = { ...foreground[i], ...p };
    patch({ foreground });
  };
  const setElementTransform = (i: number, p: Partial<Transform>) =>
    setElement(i, { transform: { ...config.foreground[i].transform, ...p } });
  const addElement = () => patch({ foreground: [...config.foreground, defaultForegroundElement('CaseCard')] });
  const removeElement = (i: number) => patch({ foreground: config.foreground.filter((_, j) => j !== i) });
  const moveElement = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= config.foreground.length) return;
    const foreground = config.foreground.slice();
    [foreground[i], foreground[j]] = [foreground[j], foreground[i]];
    patch({ foreground });
  };

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
            <ImageUpload
              label="Or upload your own"
              value={bg.imageSrc ?? ''}
              onChange={(imageSrc) => setBackground({ imageSrc })}
              hint="PNG, JPG, WebP or SVG. Stored in the composition; large images are downscaled."
            />
            <Segmented
              label="Fit"
              value={bg.imageFit ?? 'cover'}
              onChange={(imageFit) => setBackground({ imageFit })}
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'fill', label: 'Fill' },
                { value: 'none', label: 'None' },
              ]}
            />
            {(bg.imageFit ?? 'cover') !== 'fill' && (
              <SelectField
                label="Focal point"
                value={bg.imageFocus ?? 'center'}
                onChange={(imageFocus: PositionPreset) => setBackground({ imageFocus })}
                options={POSITION_OPTS}
              />
            )}
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
            <ImageUpload label="Or upload your own" value={g.src} onChange={(src) => setMid(i, { src })} hint="SVG keeps its vector crispness; rasters are downscaled." />
            <SelectField label="Position" value={g.position} onChange={(position) => setMid(i, { position })} options={POSITION_OPTS} />
            <Segmented label="Size" value={g.size} onChange={(size) => setMid(i, { size })} options={SCALE_OPTS} />
            <Slider label="Opacity" value={g.opacity} format={(v) => `${Math.round(v * 100)}%`} onChange={(opacity) => setMid(i, { opacity })} />
          </div>
        ))}
        <button type="button" onClick={addMid} className="w-full rounded-md border border-dashed border-hair py-2 text-xs font-medium text-cobalt hover:bg-cobalt/5">
          + Add graphic
        </button>
      </Section>

      {/* 4 · Foreground elements */}
      <Section
        title="Foreground elements"
        subtitle="Stack one or more UI components — each freely placed, scaled and rotated in 3-D. Later elements sit on top."
      >
        {config.foreground.length === 0 && <p className="text-xs text-muted">No elements yet.</p>}
        {config.foreground.map((el, i) => (
          <div key={el.id} className="space-y-3 rounded-md border border-hair p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ink">Element {i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveElement(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up (behind)"
                  className="rounded border border-hair px-1.5 text-xs text-muted hover:text-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveElement(i, 1)}
                  disabled={i === config.foreground.length - 1}
                  aria-label="Move down (in front)"
                  className="rounded border border-hair px-1.5 text-xs text-muted hover:text-ink disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeElement(i)}
                  className="rounded border border-hair px-2 text-xs text-muted hover:text-risk-text"
                >
                  Remove
                </button>
              </div>
            </div>
            <SelectField
              label="Component"
              value={el.content.type}
              onChange={(type: ForegroundType) => setElement(i, { content: defaultForegroundContent(type) })}
              options={FOREGROUND_OPTIONS.map((o) => ({ value: o.type, label: o.label }))}
            />
            {el.content.type !== 'none' && (
              <>
                <ElementTransformFields transform={el.transform} onChange={(p) => setElementTransform(i, p)} />
                <div className="border-t border-hair pt-3">
                  <ForegroundContentEditor content={el.content} onChange={(content) => setElement(i, { content })} />
                </div>
              </>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addElement}
          className="w-full rounded-md border border-dashed border-hair py-2 text-xs font-medium text-cobalt hover:bg-cobalt/5"
        >
          + Add element
        </button>
      </Section>

      {/* 5 · Overlay text */}
      <Section title="Overlay text">
        <Toggle label="Hide overlay text" checked={!!config.overlay.hidden} onChange={(hidden) => setOverlay({ hidden })} />
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
