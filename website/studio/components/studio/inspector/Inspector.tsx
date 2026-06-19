'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  CardsIcon,
  CaretDownIcon,
  EyeIcon,
  EyeSlashIcon,
  FrameCornersIcon,
  ImageIcon,
  ShapesIcon,
  TextTIcon,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon } from '@phosphor-icons/react';

import type {
  BackgroundKind,
  CompositionConfig,
  ElementShadow,
  ForegroundContent,
  ForegroundElement,
  ForegroundType,
  GlassConfig,
  MidGraphic,
  MidTransform,
  PatternMotif,
  PositionPreset,
  ScrimDirection,
  SizeScale,
  Transform,
} from '@/lib/composition/types';
import {
  DEFAULT_MID_TRANSFORM,
  DEFAULT_PATTERN,
  DEFAULT_SHADOW,
  DEFAULT_TRANSFORM,
  POSITION_PRESETS,
  SIZE_PRESETS,
  SIZE_SCALES,
} from '@/lib/composition/types';
import { defaultForegroundContent } from '@/lib/composition/defaults';
import {
  AURA_OPTIONS,
  BACKGROUND_IMAGE_OPTIONS,
  FOREGROUND_OPTIONS,
  MID_GRAPHIC_OPTIONS,
  foregroundAddGroups,
  foregroundOptionKey,
  groupOptions,
} from '@/lib/composition/registry';
import {
  ColorField,
  GroupedSelect,
  ImageUpload,
  Scrubber,
  Section,
  Segmented,
  SelectField,
  SubSection,
  TextArea,
  TextField,
  Toggle,
} from './controls';
import { ForegroundContentEditor } from './ForegroundContentEditor';
import { PatternControls } from './PatternControls';
import { AiContentGenerator } from './AiContentGenerator';
import { AiSceneGenerator } from './AiSceneGenerator';
import { AiImageGenerator } from './AiImageGenerator';
import {
  AI_CONTENT_MODELS,
  AI_IMAGE_MODELS,
  DEFAULT_CONTENT_MODEL,
  DEFAULT_IMAGE_MODEL,
} from '@/lib/ai/models';

const CONTENT_MODEL_OPTS = AI_CONTENT_MODELS.map((m) => ({ value: m.id, label: m.label }));
const IMAGE_MODEL_OPTS = AI_IMAGE_MODELS.map((m) => ({ value: m.id, label: m.label }));

const POSITION_OPTS = POSITION_PRESETS.map((p) => ({
  value: p,
  label: p.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));
const SCALE_OPTS = SIZE_SCALES.map((s) => ({ value: s, label: s }));
// Keyed by the picker's composite value (see foregroundOptionKey) so the two
// Pattern motif presets keep distinct labels.
const FOREGROUND_LABELS: Record<string, string> = Object.fromEntries(
  FOREGROUND_OPTIONS.map((o) => [foregroundOptionKey(o.type, o.motif), o.label]),
);
const FOREGROUND_TYPE_OPTIONS = FOREGROUND_OPTIONS.map((o) => ({
  value: foregroundOptionKey(o.type, o.motif),
  label: o.label,
}));

/** The picker value for an element's current content (Pattern → its motif key). */
function contentOptionKey(content: ForegroundContent): string {
  return content.type === 'Pattern' ? foregroundOptionKey('Pattern', content.motif) : content.type;
}

/** Build fresh content for a picked option value (motif presets seed the motif).
 *  The line-art motifs (guilloché / intaglio) default to a transparent background
 *  so they float over the canvas; the filled scene motifs keep their base fill. */
function contentForOptionKey(value: string): ForegroundContent {
  if (value.startsWith('Pattern:')) {
    const motif = value.slice('Pattern:'.length) as PatternMotif;
    const base = defaultForegroundContent('Pattern');
    const lineArt = motif === 'rosette' || motif === 'intaglio';
    return base.type === 'Pattern' ? { ...base, motif, transparent: lineArt } : base;
  }
  return defaultForegroundContent(value as ForegroundType);
}
const KIND_OPTS: { value: BackgroundKind; label: string }[] = [
  { value: 'aura', label: 'Aura' },
  { value: 'image', label: 'Image' },
  { value: 'pattern', label: 'Pattern' },
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

/** The inspector is split into panels, switched from a compact icon rail. */
type PanelId = 'size' | 'background' | 'mid' | 'foreground' | 'overlay';
const PANELS: { id: PanelId; label: string; Icon: Icon }[] = [
  { id: 'size', label: 'Canvas size', Icon: FrameCornersIcon },
  { id: 'background', label: 'Background', Icon: ImageIcon },
  { id: 'mid', label: 'Mid-ground graphics', Icon: ShapesIcon },
  { id: 'foreground', label: 'Foreground elements', Icon: CardsIcon },
  { id: 'overlay', label: 'Overlay text', Icon: TextTIcon },
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
    <SubSection title="Transform">
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Pos X" value={t.x} min={-25} max={125} step={0.5} unit="%" onChange={(x) => onChange({ x })} />
        <Scrubber label="Pos Y" value={t.y} min={-25} max={125} step={0.5} unit="%" onChange={(y) => onChange({ y })} />
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Width" value={t.width} min={0.1} max={1.4} step={0.01} unit="%" displayScale={100} onChange={(width) => onChange({ width })} />
        <Scrubber label="Scale" value={t.scale} min={0.2} max={2} step={0.01} unit="%" displayScale={100} onChange={(scale) => onChange({ scale })} />
      </div>
      <div className="grid grid-cols-3 gap-x-2">
        <Scrubber label="Rot X" value={t.rotateX} min={-180} max={180} step={1} unit="°" onChange={(rotateX) => onChange({ rotateX })} />
        <Scrubber label="Rot Y" value={t.rotateY} min={-180} max={180} step={1} unit="°" onChange={(rotateY) => onChange({ rotateY })} />
        <Scrubber label="Rot Z" value={t.rotateZ} min={-180} max={180} step={1} unit="°" onChange={(rotateZ) => onChange({ rotateZ })} />
      </div>
      {has3D && (
        <Scrubber label="Perspective" value={t.perspective} min={200} max={3000} step={50} unit="px" onChange={(perspective) => onChange({ perspective })} />
      )}
    </SubSection>
  );
}

/** Position / size / in-plane rotation controls for one mid-ground graphic (2-D only). */
function MidTransformFields({
  transform: t,
  onChange,
}: {
  transform: MidTransform;
  onChange: (p: Partial<MidTransform>) => void;
}) {
  return (
    <SubSection title="Transform">
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Pos X" value={t.x} min={-25} max={125} step={0.5} unit="%" onChange={(x) => onChange({ x })} />
        <Scrubber label="Pos Y" value={t.y} min={-25} max={125} step={0.5} unit="%" onChange={(y) => onChange({ y })} />
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Width" value={t.width} min={0.05} max={3} step={0.01} unit="%" displayScale={100} onChange={(width) => onChange({ width })} />
        <Scrubber label="Rotation" value={t.rotation} min={-180} max={180} step={1} unit="°" onChange={(rotation) => onChange({ rotation })} />
      </div>
    </SubSection>
  );
}

/** Stacked drop-shadow controls for one foreground element. */
function ElementShadowFields({
  shadows,
  onChange,
}: {
  shadows: ElementShadow[] | undefined;
  onChange: (shadows: ElementShadow[]) => void;
}) {
  const list = shadows ?? [];
  const setShadow = (i: number, p: Partial<ElementShadow>) =>
    onChange(list.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const addShadow = () => onChange([...list, { ...DEFAULT_SHADOW }]);
  const removeShadow = (i: number) => onChange(list.filter((_, j) => j !== i));

  return (
    <SubSection
      title={`Shadows${list.length ? ` · ${list.length}` : ''}`}
      action={
        <button
          type="button"
          onClick={addShadow}
          className="rounded border border-hair px-2 py-0.5 text-xs font-medium text-cobalt hover:bg-cobalt/5"
        >
          + Add shadow
        </button>
      }
    >
      {list.length === 0 && (
        <p className="text-[11px] text-muted/80">No shadow. Add one or more for layered depth.</p>
      )}
      {list.map((s, i) => (
        <div key={i} className="space-y-2 rounded border border-hair bg-white p-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-ink">Shadow {i + 1}</span>
            <button
              type="button"
              onClick={() => removeShadow(i)}
              className="rounded border border-hair px-1.5 text-xs text-muted hover:text-risk-text"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <Scrubber label="Offset X" value={s.x} min={-80} max={80} step={1} unit="px" onChange={(x) => setShadow(i, { x })} />
            <Scrubber label="Offset Y" value={s.y} min={-80} max={80} step={1} unit="px" onChange={(y) => setShadow(i, { y })} />
          </div>
          <Scrubber label="Blur" value={s.blur} min={0} max={120} step={1} unit="px" onChange={(blur) => setShadow(i, { blur })} />
          <Scrubber label="Opacity" value={s.opacity} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(opacity) => setShadow(i, { opacity })} />
          <ColorField label="Colour" value={s.color} onChange={(color) => setShadow(i, { color })} />
        </div>
      ))}
    </SubSection>
  );
}

export function Inspector({
  config,
  onChange,
}: {
  config: CompositionConfig;
  onChange: (c: CompositionConfig) => void;
}) {
  const [panel, setPanel] = useState<PanelId>('size');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCollapsed = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ---------------------------- AI model picks ---------------------------- */
  // UI preference (not part of the composition) — persisted in localStorage so a
  // chosen model survives reloads; the server still re-validates the id.
  const [contentModel, setContentModel] = useState(DEFAULT_CONTENT_MODEL);
  const [imageModel, setImageModel] = useState(DEFAULT_IMAGE_MODEL);
  useEffect(() => {
    const c = localStorage.getItem('studio.ai.contentModel');
    const i = localStorage.getItem('studio.ai.imageModel');
    if (c && AI_CONTENT_MODELS.some((m) => m.id === c)) setContentModel(c);
    if (i && AI_IMAGE_MODELS.some((m) => m.id === i)) setImageModel(i);
  }, []);
  const pickContentModel = (id: string) => {
    setContentModel(id);
    try {
      localStorage.setItem('studio.ai.contentModel', id);
    } catch {}
  };
  const pickImageModel = (id: string) => {
    setImageModel(id);
    try {
      localStorage.setItem('studio.ai.imageModel', id);
    } catch {}
  };

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
  const setMidTransform = (i: number, p: Partial<MidTransform>) =>
    setMid(i, { transform: { ...config.midGraphics[i].transform, ...p } });
  const addMid = () =>
    patch({
      midGraphics: [
        ...config.midGraphics,
        {
          id: crypto.randomUUID(),
          src: MID_GRAPHIC_OPTIONS[0]?.src ?? '',
          transform: { ...DEFAULT_MID_TRANSFORM },
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
  const setElementShadows = (i: number, shadows: ElementShadow[]) =>
    setElement(i, { shadows: shadows.length ? shadows : undefined });
  const setElementGlass = (i: number, p: Partial<GlassConfig>) =>
    setElement(i, { glass: { ...config.foreground[i].glass, ...p } });
  // Drop a fresh element of a specific kind straight in — keyed by the same
  // composite value the per-element Component dropdown uses (Pattern carries its motif).
  const addElementOfKind = (key: string) =>
    patch({
      foreground: [
        ...config.foreground,
        { id: crypto.randomUUID(), content: contentForOptionKey(key), transform: { ...DEFAULT_TRANSFORM } },
      ],
    });
  const removeElement = (i: number) => patch({ foreground: config.foreground.filter((_, j) => j !== i) });
  const duplicateElement = (i: number) => {
    const foreground = config.foreground.slice();
    foreground.splice(i + 1, 0, { ...structuredClone(config.foreground[i]), id: crypto.randomUUID() });
    patch({ foreground });
  };
  const moveElement = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= config.foreground.length) return;
    const foreground = config.foreground.slice();
    [foreground[i], foreground[j]] = [foreground[j], foreground[i]];
    patch({ foreground });
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Compact panel rail */}
      <nav className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-hair bg-white py-3">
        {PANELS.map(({ id, label, Icon }) => {
          const active = id === panel;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPanel(id)}
              title={label}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'grid h-10 w-10 place-items-center rounded-lg transition',
                active ? 'bg-cobalt/10 text-cobalt' : 'text-muted hover:bg-frost hover:text-ink',
              )}
            >
              <Icon size={20} weight={active ? 'fill' : 'regular'} />
            </button>
          );
        })}
      </nav>

      {/* Active panel */}
      <div className="min-w-0 flex-1 space-y-4 overflow-y-auto">
        {panel === 'size' && (
          <Section title="Canvas size">
            <SelectField
              label="Output preset"
              value={config.sizeId}
              onChange={(sizeId) => patch({ sizeId })}
              options={SIZE_PRESETS.map((s) => ({ value: s.id, label: s.label }))}
            />
          </Section>
        )}

        {panel === 'background' && (
          <Section title="Background" subtitle="Aura animation, raster image, a parametric pattern, or a solid fill.">
            <Segmented
              label="Type"
              value={bg.kind}
              onChange={(kind) =>
                setBackground(kind === 'pattern' && !bg.pattern ? { kind, pattern: DEFAULT_PATTERN } : { kind })
              }
              options={KIND_OPTS}
            />

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
                <SelectField label="AI image model" value={imageModel} onChange={pickImageModel} options={IMAGE_MODEL_OPTS} />
                <AiImageGenerator model={imageModel} sizeId={config.sizeId} onGenerated={(imageSrc) => setBackground({ imageSrc })} />
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
                <div className="grid grid-cols-3 gap-x-2">
                  <Scrubber
                    label="Saturation"
                    value={bg.imageSaturation ?? 1}
                    min={0}
                    max={2}
                    step={0.05}
                    unit="%"
                    displayScale={100}
                    onChange={(imageSaturation) => setBackground({ imageSaturation })}
                  />
                  <Scrubber
                    label="Brightness"
                    value={bg.imageBrightness ?? 1}
                    min={0}
                    max={2}
                    step={0.05}
                    unit="%"
                    displayScale={100}
                    onChange={(imageBrightness) => setBackground({ imageBrightness })}
                  />
                  <Scrubber
                    label="Contrast"
                    value={bg.imageContrast ?? 1}
                    min={0}
                    max={2}
                    step={0.05}
                    unit="%"
                    displayScale={100}
                    onChange={(imageContrast) => setBackground({ imageContrast })}
                  />
                </div>
              </>
            )}

            {bg.kind === 'pattern' && (
              <PatternControls
                value={bg.pattern ?? DEFAULT_PATTERN}
                onChange={(pattern) => setBackground({ pattern })}
              />
            )}

            {bg.kind === 'solid' && (
              <ColorField label="Fill colour" value={bg.color ?? '#0D1B3E'} onChange={(color) => setBackground({ color })} />
            )}

            <div className="grid grid-cols-2 gap-x-2">
              <Scrubber
                label="Opacity"
                value={bg.opacity ?? 1}
                min={0}
                max={1}
                step={0.05}
                unit="%"
                displayScale={100}
                onChange={(opacity) => setBackground({ opacity })}
              />
              <Scrubber
                label="Blur"
                value={bg.blur ?? 0}
                min={0}
                max={60}
                step={1}
                unit="px"
                onChange={(blur) => setBackground({ blur })}
              />
            </div>

            <Scrubber
              label="Scrim"
              value={config.scrim.amount}
              min={0}
              max={1}
              step={0.05}
              unit="%"
              displayScale={100}
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
        )}

        {panel === 'mid' && (
          <Section title="Mid-ground graphics" subtitle="Layer SVGs / images between background and foreground — each freely placed, scaled and rotated in 2-D.">
            <SelectField label="AI image model" value={imageModel} onChange={pickImageModel} options={IMAGE_MODEL_OPTS} />
            {config.midGraphics.length === 0 && <p className="text-xs text-muted">No graphics yet.</p>}
            {config.midGraphics.map((g, i) => (
              <div key={g.id} className="space-y-2 rounded-md border border-hair bg-white p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">Graphic {i + 1}</span>
                  <button type="button" onClick={() => removeMid(i)} className="rounded border border-hair px-2 text-xs text-muted hover:text-risk-text">
                    Remove
                  </button>
                </div>
                <GroupedSelect label="Asset" value={g.src} onChange={(src) => setMid(i, { src })} groups={groupOptions(MID_GRAPHIC_OPTIONS)} />
                <ImageUpload label="Or upload your own" value={g.src} onChange={(src) => setMid(i, { src })} hint="SVG keeps its vector crispness; rasters are downscaled." />
                <AiImageGenerator model={imageModel} sizeId={config.sizeId} onGenerated={(src) => setMid(i, { src })} />
                <MidTransformFields transform={g.transform} onChange={(p) => setMidTransform(i, p)} />
                <Scrubber label="Opacity" value={g.opacity} unit="%" displayScale={100} onChange={(opacity) => setMid(i, { opacity })} />
              </div>
            ))}
            <button type="button" onClick={addMid} className="w-full rounded-md border border-dashed border-hair py-2 text-xs font-medium text-cobalt hover:bg-cobalt/5">
              + Add graphic
            </button>
          </Section>
        )}

        {panel === 'foreground' && (
          <Section
            title="Foreground elements"
            subtitle="Stack one or more UI components — each freely placed, scaled and rotated in 3-D. Later elements sit on top."
          >
            {/* Quick-add toolbar — sticks to the top of the panel; each grouped
                button drops that component straight in (no dropdown round-trip). */}
            <div className="sticky top-0 z-10 -mx-3 -mt-2.5 max-h-[48vh] overflow-y-auto border-b border-hair bg-white px-3 pb-2.5 pt-2.5">
              <div className="space-y-2">
                {foregroundAddGroups().map(({ group, options }) => (
                  <div key={group}>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{group}</div>
                    <div className="flex flex-wrap gap-1">
                      {options.map((o) => (
                        <button
                          key={o.key}
                          type="button"
                          onClick={() => addElementOfKind(o.key)}
                          className="rounded-md border border-hair bg-white px-2 py-1 text-[11px] font-medium text-ink transition hover:border-cobalt hover:bg-cobalt/5 hover:text-cobalt"
                        >
                          + {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SelectField label="AI content model" value={contentModel} onChange={pickContentModel} options={CONTENT_MODEL_OPTS} />
            <AiSceneGenerator
              model={contentModel}
              onGenerated={(elements) => patch({ foreground: [...config.foreground, ...elements] })}
            />
            {config.foreground.length === 0 && <p className="text-xs text-muted">No elements yet.</p>}
            {config.foreground.map((el, i) => {
              const isCollapsed = collapsed.has(el.id);
              return (
              <div key={el.id} className="space-y-3 rounded-md border border-hair bg-white p-2.5">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleCollapsed(el.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCollapsed(el.id);
                    }
                  }}
                  aria-expanded={!isCollapsed}
                  aria-label={isCollapsed ? 'Expand element' : 'Collapse element'}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded -m-1 p-1 hover:bg-frost"
                >
                  <div className={clsx('flex min-w-0 flex-1 items-center gap-1.5 text-left', el.hidden && 'opacity-40')}>
                    <CaretDownIcon
                      size={12}
                      weight="bold"
                      className={clsx('shrink-0 text-muted transition-transform', isCollapsed && '-rotate-90')}
                    />
                    <span className="shrink-0 text-xs font-semibold text-ink">Element {i + 1}</span>
                    <span className="truncate text-[11px] text-muted">{FOREGROUND_LABELS[contentOptionKey(el.content)]}</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setElement(i, { hidden: !el.hidden })}
                      aria-label={el.hidden ? 'Show element' : 'Hide element'}
                      aria-pressed={el.hidden}
                      title={el.hidden ? 'Show element' : 'Hide element'}
                      className={clsx(
                        'grid h-[22px] w-[22px] place-items-center rounded border border-hair hover:text-ink',
                        el.hidden ? 'text-cobalt' : 'text-muted',
                      )}
                    >
                      {el.hidden ? <EyeSlashIcon size={13} weight="bold" /> : <EyeIcon size={13} weight="bold" />}
                    </button>
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
                      onClick={() => duplicateElement(i)}
                      aria-label="Duplicate element"
                      className="rounded border border-hair px-2 text-xs text-muted hover:text-ink"
                    >
                      Duplicate
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
                {!isCollapsed && (
                  <>
                <SelectField
                  label="Component"
                  value={contentOptionKey(el.content)}
                  onChange={(value: string) => setElement(i, { content: contentForOptionKey(value) })}
                  options={FOREGROUND_TYPE_OPTIONS}
                />
                {el.content.type !== 'none' && (
                  <>
                    <ElementTransformFields transform={el.transform} onChange={(p) => setElementTransform(i, p)} />
                    <SubSection title="Glass">
                      <div className="grid grid-cols-2 gap-x-2">
                        <Scrubber label="Tint" value={el.glass?.tint ?? 0.7} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(tint) => setElementGlass(i, { tint })} />
                        <Scrubber label="Blur" value={el.glass?.blur ?? 24} min={0} max={60} step={1} unit="px" onChange={(blur) => setElementGlass(i, { blur })} />
                      </div>
                    </SubSection>
                    <ElementShadowFields shadows={el.shadows} onChange={(shadows) => setElementShadows(i, shadows)} />
                    <div className="space-y-3 border-t border-hair pt-3">
                      {el.content.type !== 'Pattern' && (
                        <AiContentGenerator
                          type={el.content.type}
                          current={el.content}
                          model={contentModel}
                          onGenerated={(content) => setElement(i, { content })}
                        />
                      )}
                      <ForegroundContentEditor content={el.content} onChange={(content) => setElement(i, { content })} />
                    </div>
                  </>
                )}
                  </>
                )}
              </div>
              );
            })}
          </Section>
        )}

        {panel === 'overlay' && (
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
        )}
      </div>
    </div>
  );
}
