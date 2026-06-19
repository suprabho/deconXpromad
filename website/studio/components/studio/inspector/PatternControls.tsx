'use client';

import {
  DEFAULT_GUILLOCHE,
  DEFAULT_INTAGLIO,
  PATTERN_MOTIFS,
  RIPPLE_SHAPES,
  type GuillocheConfig,
  type IntaglioConfig,
  type PatternConfig,
  type PatternMotif,
  type RippleShape,
  type RippleShapeKind,
} from '@/lib/composition/types';
import { ColorField, Scrubber, SelectField, SubSection } from './controls';
import PATTERN_PALETTE from '@/lib/composition/palette.json';

/**
 * The single control surface for a {@link PatternConfig}. Used in TWO places with
 * identical UI: the Background panel (`bg.pattern`) and a foreground element of
 * type 'Pattern'. Operates purely on the PatternConfig fields; each caller wraps
 * `onChange` to slot the result back into its own shape (a background patch, or a
 * `{ type:'Pattern', … }` foreground content).
 *
 * The `intaglio` motif adds a two-part sub-panel (Waves · Ripple), each with its
 * own colour palette; see {@link IntaglioControls}. The `rosette` motif is driven
 * by the explicit spirograph fields (see {@link GuillocheControls}), so its
 * seed/density/scale/line-weight generics are hidden in favour of those.
 */
export function PatternControls({
  value,
  onChange,
}: {
  value: PatternConfig;
  onChange: (next: PatternConfig) => void;
}) {
  const set = (p: Partial<PatternConfig>) => onChange({ ...value, ...p });
  // Rosette owns its scale / line-thickness / repeat-count, so the generic
  // Density / Scale / Line-weight / Seed scrubbers don't apply to it.
  const isRosette = value.motif === 'rosette';
  return (
    <div className="space-y-2.5">
      <SelectField
        label="Motif"
        value={value.motif}
        onChange={(motif: PatternMotif) => set({ motif })}
        options={PATTERN_MOTIFS}
      />
      <div className="grid grid-cols-2 gap-x-2">
        {!isRosette && <Scrubber label="Density" value={value.density} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(density) => set({ density })} />}
        {!isRosette && <Scrubber label="Scale" value={value.scale} min={0.1} max={1} step={0.05} unit="%" displayScale={100} onChange={(scale) => set({ scale })} />}
        {!isRosette && <Scrubber label="Line weight" value={value.lineWidth} min={0.5} max={4} step={0.1} onChange={(lineWidth) => set({ lineWidth })} />}
        <Scrubber label="Glow" value={value.glow} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(glow) => set({ glow })} />
        {!isRosette && <Scrubber label="Seed" value={value.seed} min={1} max={999} step={1} onChange={(seed) => set({ seed })} />}
        <Scrubber label="Vignette" value={value.vignette} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(vignette) => set({ vignette })} />
      </div>
      <SubSection title="Colours">
        <ColorField label="Base" value={value.baseColor} onChange={(baseColor) => set({ baseColor })} />
        <ColorField label="Accent" value={value.accent} onChange={(accent) => set({ accent })} />
        <ColorField label="Node / highlight" value={value.nodeColor} onChange={(nodeColor) => set({ nodeColor })} />
      </SubSection>

      {value.motif === 'rosette' && (
        <GuillocheControls value={value.guilloche ?? DEFAULT_GUILLOCHE} onChange={(guilloche) => set({ guilloche })} />
      )}
      {value.motif === 'intaglio' && (
        <IntaglioControls value={value.intaglio ?? DEFAULT_INTAGLIO} onChange={(intaglio) => set({ intaglio })} />
      )}
    </div>
  );
}

/**
 * The spirograph guilloché generator fields (timestretch.com), edited directly:
 * four frequency/amplitude term pairs (Angle / Scale A–D), the B-term phase
 * Offset, the per-pass amplitude drift Repeat offset over Repeat count passes,
 * plus Line thickness and overall Scale.
 */
function GuillocheControls({ value, onChange }: { value: GuillocheConfig; onChange: (v: GuillocheConfig) => void }) {
  const set = (p: Partial<GuillocheConfig>) => onChange({ ...value, ...p });
  return (
    <SubSection title="Guilloché">
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Angle A" value={value.angleA} min={-72} max={72} step={1} onChange={(angleA) => set({ angleA })} />
        <Scrubber label="Angle B" value={value.angleB} min={-72} max={72} step={1} onChange={(angleB) => set({ angleB })} />
        <Scrubber label="Angle C" value={value.angleC} min={-72} max={72} step={1} onChange={(angleC) => set({ angleC })} />
        <Scrubber label="Angle D" value={value.angleD} min={-72} max={72} step={1} onChange={(angleD) => set({ angleD })} />
        <Scrubber label="Scale A" value={value.scaleA} min={-360} max={360} step={1} onChange={(scaleA) => set({ scaleA })} />
        <Scrubber label="Scale B" value={value.scaleB} min={-360} max={360} step={1} onChange={(scaleB) => set({ scaleB })} />
        <Scrubber label="Scale C" value={value.scaleC} min={-360} max={360} step={1} onChange={(scaleC) => set({ scaleC })} />
        <Scrubber label="Scale D" value={value.scaleD} min={-360} max={360} step={1} onChange={(scaleD) => set({ scaleD })} />
        <Scrubber label="Offset" value={value.offset} min={-360} max={360} step={1} unit="°" onChange={(offset) => set({ offset })} />
        <Scrubber label="Repeat offset" value={value.repeatOffset} min={-100} max={100} step={1} onChange={(repeatOffset) => set({ repeatOffset })} />
        <Scrubber label="Repeat count" value={value.repeatCount} min={1} max={50} step={1} onChange={(repeatCount) => set({ repeatCount })} />
        <Scrubber label="Line thickness" value={value.lineThickness} min={0.2} max={6} step={0.1} onChange={(lineThickness) => set({ lineThickness })} />
        <Scrubber label="Scale" value={value.scale} min={10} max={200} step={1} unit="%" onChange={(scale) => set({ scale })} />
        <Scrubber label="X" value={value.x} min={-50} max={50} step={1} unit="%" onChange={(x) => set({ x })} />
        <Scrubber label="Y" value={value.y} min={-50} max={50} step={1} unit="%" onChange={(y) => set({ y })} />
      </div>
    </SubSection>
  );
}

/** A small heading inside a SubSection, to label the Start / End shape groups. */
function MiniLabel({ children }: { children: React.ReactNode }) {
  return <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{children}</span>;
}

/** The fixed pattern palette (the spec's palette-lock), loaded from JSON. */
const PALETTE = PATTERN_PALETTE as { name: string; hex: string }[];

/**
 * A compact, add/remove-able list of palette colours — cycled across the wave
 * rows or the ripple rings. Each slot is chosen from the FIXED JSON palette
 * ({@link PALETTE}, no free colour entry): one swatch strip per slot, the active
 * swatch ringed. The last colour cannot be removed (the renderer needs ≥ 1).
 */
function ColorList({ label, colors, onChange }: { label: string; colors: string[]; onChange: (c: string[]) => void }) {
  const setAt = (i: number, hex: string) => {
    const next = colors.slice();
    next[i] = hex;
    onChange(next);
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <MiniLabel>{label}</MiniLabel>
        <button
          type="button"
          onClick={() => onChange([...colors, colors[colors.length - 1] ?? PALETTE[0].hex])}
          className="rounded border border-hair px-2 py-0.5 text-xs text-cobalt hover:bg-cobalt/5"
        >
          + Add
        </button>
      </div>
      {colors.map((c, i) => {
        const current = c.toUpperCase();
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-1 flex-wrap gap-1" role="group" aria-label={`${label} ${i + 1}`}>
              {PALETTE.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  title={`${s.name} · ${s.hex}`}
                  aria-label={`${s.name} (${s.hex})`}
                  aria-pressed={current === s.hex.toUpperCase()}
                  onClick={() => setAt(i, s.hex)}
                  className={
                    current === s.hex.toUpperCase()
                      ? 'h-5 w-5 rounded-sm border border-cobalt ring-2 ring-cobalt/30 transition'
                      : 'h-5 w-5 rounded-sm border border-hair transition hover:scale-110'
                  }
                  style={{ background: s.hex }}
                />
              ))}
            </div>
            {colors.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(colors.filter((_, j) => j !== i))}
                aria-label={`Remove colour ${i + 1}`}
                className="shrink-0 rounded border border-hair px-2 text-xs text-muted hover:text-risk-text"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Scale / position / rotation editor for one end of the ripple morph. */
function ShapeFields({ shape, onChange }: { shape: RippleShape; onChange: (s: RippleShape) => void }) {
  const set = (p: Partial<RippleShape>) => onChange({ ...shape, ...p });
  return (
    <div className="space-y-2">
      <SelectField label="Shape" value={shape.kind} onChange={(kind: RippleShapeKind) => set({ kind })} options={RIPPLE_SHAPES} />
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Scale" value={shape.scale} min={0.05} max={2} step={0.01} unit="%" displayScale={100} onChange={(scale) => set({ scale })} />
        <Scrubber label="Rotation" value={shape.rotation} min={0} max={360} step={1} unit="°" onChange={(rotation) => set({ rotation })} />
        <Scrubber label="X" value={shape.x} min={-50} max={50} step={1} unit="%" onChange={(x) => set({ x })} />
        <Scrubber label="Y" value={shape.y} min={-50} max={50} step={1} unit="%" onChange={(y) => set({ y })} />
      </div>
    </div>
  );
}

/**
 * The intaglio engraving, broken into its two editable systems:
 *   1. Waves  — amplitude · frequency · phase offset + a colour palette.
 *   2. Ripple — start shape + end shape (each scale/position/rotation) + steps +
 *               a colour palette cycled across the rings.
 */
function IntaglioControls({ value, onChange }: { value: IntaglioConfig; onChange: (v: IntaglioConfig) => void }) {
  const setWaves = (p: Partial<IntaglioConfig['waves']>) => onChange({ ...value, waves: { ...value.waves, ...p } });
  const setRipple = (p: Partial<IntaglioConfig['ripple']>) => onChange({ ...value, ripple: { ...value.ripple, ...p } });
  return (
    <>
      <SubSection title="Waves">
        <Scrubber label="Amplitude" value={value.waves.amplitude} min={0} max={80} step={1} unit="px" onChange={(amplitude) => setWaves({ amplitude })} />
        <Scrubber label="Frequency" value={value.waves.frequency} min={0.2} max={4} step={0.1} unit="×" onChange={(frequency) => setWaves({ frequency })} />
        <Scrubber label="Phase offset" value={value.waves.phase} min={0} max={360} step={5} unit="°" onChange={(phase) => setWaves({ phase })} />
        <ColorList label="Colours" colors={value.waves.colors} onChange={(colors) => setWaves({ colors })} />
      </SubSection>

      <SubSection title="Ripple">
        <MiniLabel>Start shape</MiniLabel>
        <ShapeFields shape={value.ripple.start} onChange={(start) => setRipple({ start })} />
        <MiniLabel>End shape</MiniLabel>
        <ShapeFields shape={value.ripple.end} onChange={(end) => setRipple({ end })} />
        <Scrubber label="Steps" value={value.ripple.steps} min={2} max={40} step={1} onChange={(steps) => setRipple({ steps })} />
        <ColorList label="Colours" colors={value.ripple.colors} onChange={(colors) => setRipple({ colors })} />
      </SubSection>
    </>
  );
}
