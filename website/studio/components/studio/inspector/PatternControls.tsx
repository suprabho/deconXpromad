'use client';

import { PATTERN_MOTIFS, type PatternConfig, type PatternMotif } from '@/lib/composition/types';
import { ColorField, Scrubber, SelectField, SubSection } from './controls';

/**
 * The single control surface for a {@link PatternConfig}. Used in TWO places with
 * identical UI: the Background panel (`bg.pattern`) and a foreground element of
 * type 'Pattern'. Operates purely on the PatternConfig fields; each caller wraps
 * `onChange` to slot the result back into its own shape (a background patch, or a
 * `{ type:'Pattern', … }` foreground content).
 */
export function PatternControls({
  value,
  onChange,
}: {
  value: PatternConfig;
  onChange: (next: PatternConfig) => void;
}) {
  const set = (p: Partial<PatternConfig>) => onChange({ ...value, ...p });
  return (
    <div className="space-y-2.5">
      <SelectField
        label="Motif"
        value={value.motif}
        onChange={(motif: PatternMotif) => set({ motif })}
        options={PATTERN_MOTIFS}
      />
      <div className="grid grid-cols-2 gap-x-2">
        <Scrubber label="Density" value={value.density} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(density) => set({ density })} />
        <Scrubber label="Scale" value={value.scale} min={0.1} max={1} step={0.05} unit="%" displayScale={100} onChange={(scale) => set({ scale })} />
        <Scrubber label="Line weight" value={value.lineWidth} min={0.5} max={4} step={0.1} onChange={(lineWidth) => set({ lineWidth })} />
        <Scrubber label="Glow" value={value.glow} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(glow) => set({ glow })} />
        <Scrubber label="Seed" value={value.seed} min={1} max={999} step={1} onChange={(seed) => set({ seed })} />
        <Scrubber label="Vignette" value={value.vignette} min={0} max={1} step={0.05} unit="%" displayScale={100} onChange={(vignette) => set({ vignette })} />
      </div>
      <SubSection title="Colours">
        <ColorField label="Base" value={value.baseColor} onChange={(baseColor) => set({ baseColor })} />
        <ColorField label="Accent" value={value.accent} onChange={(accent) => set({ accent })} />
        <ColorField label="Node / highlight" value={value.nodeColor} onChange={(nodeColor) => set({ nodeColor })} />
      </SubSection>
    </div>
  );
}
