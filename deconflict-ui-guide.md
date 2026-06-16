# Deconfliction Case-Overlap UI — Next.js Build Guide

A component-by-component guide to rebuilding the interface as a real Next.js banner.
Stack: **Next.js (App Router) + Tailwind CSS + Phosphor icons**. Every element is its
own component so the redaction, connector, and timeline logic stays reusable instead of
baked into one giant JSX blob.

---

## 0. Mental model

The screen is six independent pieces. Build them in this order — each one is usable on its own:

```
OverlapAlert        ← amber status bar
CaseCard            ← one investigation panel (used twice, mirrored)
 ├─ FieldRow        ← label + value row
 ├─ RedactedValue   ← the masking primitive (full / partial / revealed)
 └─ RiskPill        ← coloured tier badge
ConnectorNode       ← centre "3 Matches" chip + the orange fan lines (SVG)
ActivityTimeline    ← two tracks + overlap markers (SVG, data-driven)
DeconflictBanner    ← composition + layout grid
```

The one rule that makes this design work: **disclosure is data, not decoration.** Each
field carries its own reveal state (`masked | partial | revealed`), and the connector/
timeline are driven by a small data object, not pixel-positioned by hand. That's what lets
you reuse it for any case pair and, given your scroll-beat architecture, animate the reveal
on scroll.

---

## 1. Setup

```bash
npm i @phosphor-icons/react
```

Add design tokens to `tailwind.config.ts` so colours are named, not scattered hex:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A2332",        // navy — sidebar, LE track, headings
        alert: {
          bg: "#FCE3B4",       // amber banner fill
          border: "#F2C879",
          icon: "#B7791F",
        },
        field: {
          bg: "#FDF6E3",       // butter-yellow highlighted field
          border: "#EFE0B0",
        },
        match: "#E8941F",      // orange — connectors + overlap markers
        le: "#1A2332",         // law-enforcement track
        fi: "#2563EB",         // financial-institution track
        risk: {
          bg: "#FCEAEA",
          text: "#C0392B",
        },
        muted: "#6B7280",
        hair: "#E5E7EB",       // card borders / hairlines
      },
      fontFamily: {
        // swap for your actual faces; utility/mono carries the IDs + addresses
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
} satisfies Config;
```

---

## 2. OverlapAlert — the amber status bar

Status, not failure. Amber (not red) is the deliberate choice. Keep it a single flex row
with the icon, a two-part title, and a right-aligned timestamp.

```tsx
// components/deconflict/OverlapAlert.tsx
import { Warning } from "@phosphor-icons/react/dist/ssr";

export function OverlapAlert({
  status = "ACTIVE OVERLAP",
  detail = "Case Overlap Detected",
  timestamp,
}: {
  status?: string;
  detail?: string;
  timestamp: string;
}) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl border border-alert-border
                 bg-alert-bg px-5 py-3.5 text-ink"
    >
      <Warning weight="fill" className="h-5 w-5 shrink-0 text-alert-icon" />
      <p className="text-sm font-semibold tracking-wide">
        {status} <span className="font-medium opacity-80">— {detail}</span>
      </p>
      <time className="ml-auto text-xs font-medium text-ink/70">{timestamp}</time>
    </div>
  );
}
```

> `/dist/ssr` import path gives you the static (server-renderable) icon variant, so the alert
> doesn't force the whole banner to be a client component.

---

## 3. The masking primitive — RedactedValue

This is the most reusable piece. Three states drive everything:

- `masked` — full privacy dots (Subject Name)
- `partial` — visible prefix + dots (`TX-••••••••`)
- `revealed` — plaintext, the field that *earned* the match (wallet address)

```tsx
// components/deconflict/RedactedValue.tsx
type Reveal = "masked" | "partial" | "revealed";

function Dots({ count = 7 }: { count?: number }) {
  return (
    <span aria-hidden className="tracking-[0.25em] text-ink/80">
      {"•".repeat(count)}
    </span>
  );
}

export function RedactedValue({
  value,
  reveal = "masked",
  prefix,
  groups = [7, 7], // dot-group lengths for the "masked" look
}: {
  value: string;
  reveal?: Reveal;
  prefix?: string;     // e.g. "TX-" for partial
  groups?: number[];
}) {
  if (reveal === "revealed") {
    return <span className="font-mono text-ink">{value}</span>;
  }
  if (reveal === "partial") {
    return (
      <span className="font-mono text-ink" aria-label="partially redacted value">
        {prefix}
        <Dots count={8} />
      </span>
    );
  }
  // masked
  return (
    <span className="flex items-center gap-2" aria-label="redacted value">
      {groups.map((g, i) => (
        <Dots key={i} count={g} />
      ))}
    </span>
  );
}
```

`aria-label` keeps screen readers honest — they announce "redacted value", never the dots.

---

## 4. FieldRow, RiskPill, CaseCard

A field is a label + a value, where the value can be plain text, a redacted value, or a
pill. Highlighted rows (the matched ones) get the butter-yellow field treatment.

```tsx
// components/deconflict/FieldRow.tsx
import { clsx } from "clsx"; // or cn() helper of your choice

export function FieldRow({
  label,
  children,
  highlighted = false,
}: {
  label: string;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-hair">
      <span className="text-sm text-muted">{label}</span>
      <div
        className={clsx(
          "flex min-h-9 items-center rounded-md px-3 text-sm",
          highlighted
            ? "bg-field-bg border border-field-border"
            : "bg-transparent"
        )}
      >
        {children}
      </div>
    </div>
  );
}
```

```tsx
// components/deconflict/RiskPill.tsx
export function RiskPill({ tier }: { tier: "High" | "Medium" | "Low" }) {
  const map = {
    High: "bg-risk-bg text-risk-text",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-emerald-50 text-emerald-700",
  } as const;
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${map[tier]}`}>
      {tier}
    </span>
  );
}
```

```tsx
// components/deconflict/CaseCard.tsx
import { FieldRow } from "./FieldRow";
import { RedactedValue } from "./RedactedValue";
import { RiskPill } from "./RiskPill";

export type CaseData = {
  title: string;          // "LAW ENFORCEMENT CASE"
  subtitle: string;       // "FBI · Field Office 14 · Case #LE-2024-08821"
  subjectName: string;
  walletAddress: string;
  transactionId: string;
  dateOpened: string;
  riskTier: "High" | "Medium" | "Low";
};

export function CaseCard({ data }: { data: CaseData }) {
  return (
    <article className="overflow-hidden rounded-xl border border-hair bg-white">
      <header className="px-5 pt-5 pb-4">
        <h3 className="text-base font-bold tracking-wide text-ink">{data.title}</h3>
        <p className="mt-1 text-sm text-muted">{data.subtitle}</p>
      </header>

      <FieldRow label="Subject Name" highlighted>
        <RedactedValue value={data.subjectName} reveal="masked" />
      </FieldRow>

      <FieldRow label="Wallet Address" highlighted>
        <RedactedValue value={data.walletAddress} reveal="revealed" />
      </FieldRow>

      <FieldRow label="Transaction ID" highlighted>
        <RedactedValue value={data.transactionId} reveal="partial" prefix="TX-" />
      </FieldRow>

      <FieldRow label="Date Opened">
        <span className="text-ink">{data.dateOpened}</span>
      </FieldRow>

      <FieldRow label="Risk Tier">
        <RiskPill tier={data.riskTier} />
      </FieldRow>
    </article>
  );
}
```

---

## 5. ConnectorNode — the "3 Matches" chip + orange fan

Two parts: a centered circular chip, and SVG curves fanning to the matched rows on each
side. Don't try to pixel-place the lines — draw them in an SVG that spans the gap, anchored
to fractional y-positions that line up with your matched rows.

```tsx
// components/deconflict/ConnectorNode.tsx
"use client";
import { LinkSimple } from "@phosphor-icons/react";

// yAnchors: fractions (0–1) of the SVG height where the matched rows sit.
// Tune these to match your three highlighted rows.
const yAnchors = [0.3, 0.5, 0.7];

export function ConnectorNode({ matches = 3 }: { matches?: number }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* fan lines behind the chip */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {yAnchors.map((y, i) => (
          <g key={i} stroke="#E8941F" strokeWidth="0.8" fill="none">
            {/* left card → node */}
            <path d={`M0 ${y * 100} C 30 ${y * 100}, 35 50, 50 50`} />
            {/* node → right card */}
            <path d={`M50 50 C 65 50, 70 ${y * 100}, 100 ${y * 100}`} />
          </g>
        ))}
      </svg>

      {/* the chip */}
      <div className="relative z-10 flex h-20 w-20 flex-col items-center justify-center
                      rounded-full border border-hair bg-white shadow-md">
        <LinkSimple weight="bold" className="h-5 w-5 text-match" />
        <span className="mt-0.5 text-xs font-semibold text-ink">
          {matches} {matches === 1 ? "Match" : "Matches"}
        </span>
      </div>
    </div>
  );
}
```

> **Precise anchoring:** if you want the lines to lock to actual row centers regardless of
> content height, give each matched `FieldRow` a `ref`, measure `getBoundingClientRect()`
> against the connector container in a `useLayoutEffect`, and feed real y-fractions into
> `yAnchors`. The hardcoded version above is fine for a fixed-layout banner.

---

## 6. ActivityTimeline — two tracks, data-driven

Drive it from data so any case pair renders correctly. A tiny date→fraction helper does the
scaling; SVG handles the dashed overlap markers cleanly.

```tsx
// components/deconflict/ActivityTimeline.tsx
const RANGE_START = new Date("2024-04-01");
const RANGE_END = new Date("2024-07-01");

function frac(date: string) {
  const t = new Date(date).getTime();
  return (t - RANGE_START.getTime()) / (RANGE_END.getTime() - RANGE_START.getTime());
}

type Segment = { from: string; to: string; faded?: boolean };
type Track = { label: string; color: string; segments: Segment[] };

export function ActivityTimeline({
  tracks,
  overlaps, // ISO dates where both cases were active
  ticks,    // axis labels: [{ date, label }]
}: {
  tracks: Track[];
  overlaps: string[];
  ticks: { date: string; label: string }[];
}) {
  const H = 120;
  const rowY = (i: number) => 30 + i * 34;

  return (
    <div className="rounded-xl border border-hair bg-white p-5">
      <h4 className="mb-4 text-sm font-bold tracking-wide text-ink">CASE ACTIVITY TIMELINE</h4>
      <div className="flex gap-6">
        {/* legend */}
        <ul className="w-44 space-y-3 pt-3 text-sm text-muted">
          {tracks.map((t) => (
            <li key={t.label} className="flex items-center gap-2">
              <span className="h-1 w-6 rounded-full" style={{ background: t.color }} />
              {t.label}
            </li>
          ))}
        </ul>

        {/* chart */}
        <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none"
             className="h-32 flex-1" aria-label="case activity timeline">
          {/* overlap markers */}
          {overlaps.map((d) => (
            <line key={d} x1={frac(d) * 100} x2={frac(d) * 100} y1={10} y2={H - 24}
                  stroke="#E8941F" strokeWidth="0.4" strokeDasharray="2 2" />
          ))}
          {/* tracks */}
          {tracks.map((t, i) =>
            t.segments.map((s, j) => (
              <line key={`${i}-${j}`}
                    x1={frac(s.from) * 100} x2={frac(s.to) * 100}
                    y1={rowY(i)} y2={rowY(i)}
                    stroke={t.color} strokeWidth="3" strokeLinecap="round"
                    opacity={s.faded ? 0.25 : 1} />
            ))
          )}
          {/* overlap dots on the first track */}
          {overlaps.map((d) => (
            <circle key={`dot-${d}`} cx={frac(d) * 100} cy={rowY(0)} r="1.6" fill="#E8941F" />
          ))}
          {/* axis ticks */}
          {ticks.map((tk) => (
            <text key={tk.date} x={frac(tk.date) * 100} y={H - 8}
                  fontSize="4" fill="#6B7280" textAnchor="middle">
              {tk.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
```

> SVG `strokeWidth` is in viewBox units. Because `preserveAspectRatio="none"` stretches the
> box, vertical strokes (markers) thin out and horizontal strokes (tracks) thicken. If that
> bothers you at very wide widths, switch the tracks to positioned `<div>`s with percentage
> `left`/`width` and keep only the dashed markers in SVG.

---

## 7. DeconflictBanner — composition

The layout is a three-column grid on desktop (card · connector · card) that collapses to a
stack on mobile, with the alert on top and the timeline spanning full width below.

```tsx
// components/deconflict/DeconflictBanner.tsx
import { OverlapAlert } from "./OverlapAlert";
import { CaseCard, type CaseData } from "./CaseCard";
import { ConnectorNode } from "./ConnectorNode";
import { ActivityTimeline } from "./ActivityTimeline";

export function DeconflictBanner({
  leftCase, rightCase,
}: { leftCase: CaseData; rightCase: CaseData }) {
  return (
    <section className="mx-auto max-w-6xl space-y-5 p-6">
      <OverlapAlert timestamp="May 14, 2025 10:24 AM EDT" />

      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <CaseCard data={leftCase} />
        <div className="hidden md:block w-32">
          <ConnectorNode matches={3} />
        </div>
        <CaseCard data={rightCase} />
      </div>

      <ActivityTimeline
        tracks={[
          { label: "Law Enforcement Case", color: "#1A2332",
            segments: [{ from: "2024-04-05", to: "2024-06-10" },
                       { from: "2024-05-01", to: "2024-05-25", faded: true }] },
          { label: "Financial Institution Case", color: "#2563EB",
            segments: [{ from: "2024-04-01", to: "2024-04-12", faded: true },
                       { from: "2024-04-12", to: "2024-06-20" }] },
        ]}
        overlaps={["2024-05-01", "2024-05-12", "2024-06-01"]}
        ticks={[
          { date: "2024-04-01", label: "Apr 1" }, { date: "2024-04-15", label: "Apr 15" },
          { date: "2024-05-01", label: "May 1" }, { date: "2024-05-12", label: "May 12" },
          { date: "2024-06-01", label: "Jun 1" }, { date: "2024-06-15", label: "Jun 15" },
          { date: "2024-07-01", label: "Jul 1" },
        ]}
      />
    </section>
  );
}
```

On mobile the connector is hidden (it has no meaning when cards stack vertically); replace it
with a small inline "3 matches" chip between the cards if you want to keep the signal.

---

## 8. Hooking into scroll beats

Since your scrollytelling platform drives plugin state from scroll "beats", expose a single
`beat` prop and map it to reveal states rather than animating internals directly. The banner
becomes a deterministic function of the beat:

```tsx
// beat 0: everything masked → beat 1: wallet reveals → beat 2: connector draws →
// beat 3: timeline overlaps light up
const revealForBeat = (beat: number) => ({
  subject: "masked" as const,
  wallet: beat >= 1 ? "revealed" : "masked",
  txn: beat >= 1 ? "partial" : "masked",
  showConnector: beat >= 2,
  showOverlaps: beat >= 3,
});
```

For the connector "draw-on", animate SVG `stroke-dashoffset`; for the timeline markers,
animate their `opacity`. Both respect `prefers-reduced-motion` — gate the animation classes
behind `motion-safe:`.

---

## 9. Quality floor

- **A11y:** alert is `role="status"`; redacted values announce "redacted value" not dots;
  timeline `<svg>` has an `aria-label`; risk pills rely on text, not colour alone.
- **Responsive:** grid → stack under `md`; connector hidden when stacked; timeline legend
  drops above the chart on narrow widths.
- **Motion:** wrap reveal/draw animations in `motion-safe:`; provide a static end-state.
- **Fonts:** put the wallet address, transaction ID, and case numbers in the mono face — the
  monospace alignment is what makes the "these two strings are identical" match read instantly.

---

## File tree

```
components/deconflict/
  OverlapAlert.tsx
  RedactedValue.tsx
  FieldRow.tsx
  RiskPill.tsx
  CaseCard.tsx
  ConnectorNode.tsx
  ActivityTimeline.tsx
  DeconflictBanner.tsx
```

Drop `<DeconflictBanner leftCase={…} rightCase={…} />` into any `page.tsx`. Everything above
the timeline is server-renderable; only `ConnectorNode` (and any scroll-driven wrapper) needs
`"use client"`.
