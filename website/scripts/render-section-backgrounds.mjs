// Renders six full-bleed section BACKGROUND scenes for the Deconflict homepage.
// Each is an ambient wash meant to sit *behind* section copy — not a standalone asset.
// SVG is authored here, rasterized to PNG via sharp (no live Aura iframes).
//
//   node scripts/render-section-backgrounds.mjs
//
// Output: asset-showcase/public/images/sections/s{1..6}-bg.png

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from '../asset-showcase/node_modules/sharp/lib/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../asset-showcase/public/images/sections');

const W = 2400, H = 1350;

// Brand tokens (from asset-showcase/app/globals.css)
const NAVY = '#0d1b3e';
const NAVY_DEEP = '#08122c';
const NAVY_ABYSS = '#050b1e';
const HALO = '#16306b';
const COBALT = '#1a56db';
const COBALT_HOT = '#2f6bff';
const SKY = '#3b82f6';
const NODE = '#cbd8ff';
const FROST = '#f4f6fb';

// Deterministic scatter — no Math.random so renders are reproducible.
function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const svgShell = (defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<defs>${defs}</defs>${body}</svg>`;

// A soft radial glow gradient that fades to fully transparent.
const glow = (id, color, inner = 0.6) =>
  `<radialGradient id="${id}">` +
  `<stop offset="0%" stop-color="${color}" stop-opacity="${inner}"/>` +
  `<stop offset="55%" stop-color="${color}" stop-opacity="${(inner * 0.45).toFixed(3)}"/>` +
  `<stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient>`;

const vignette = (id, edge = NAVY_ABYSS, op = 0.75) =>
  `<radialGradient id="${id}" cx="50%" cy="46%" r="72%">` +
  `<stop offset="55%" stop-color="${edge}" stop-opacity="0"/>` +
  `<stop offset="100%" stop-color="${edge}" stop-opacity="${op}"/></radialGradient>`;

const ell = (cx, cy, rx, ry, fill, op = 1) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${fill})" opacity="${op}"/>`;

// Hexagon "verified node" centred at (cx,cy), radius r.
function hex(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

const baseRadial = (id, c0, c1, c2, cx = '50%', cy = '40%', r = '90%') =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">` +
  `<stop offset="0%" stop-color="${c0}"/>` +
  `<stop offset="55%" stop-color="${c1}"/>` +
  `<stop offset="100%" stop-color="${c2}"/></radialGradient>`;

// ─────────────────────────────────────────────────────────────────────────
// S1 — Banner / hero. Ethereal cobalt colour blends drifting over navy.
// ─────────────────────────────────────────────────────────────────────────
function s1() {
  const defs =
    baseRadial('s1base', HALO, NAVY, NAVY_DEEP, '34%', '28%', '95%') +
    glow('s1a', COBALT, 0.55) + glow('s1b', COBALT_HOT, 0.5) +
    glow('s1c', SKY, 0.4) + glow('s1d', HALO, 0.7) +
    vignette('s1vig', NAVY_ABYSS, 0.82);
  const body =
    `<rect width="${W}" height="${H}" fill="url(#s1base)"/>` +
    ell(560, 360, 760, 620, 's1a', 0.9) +
    ell(1680, 250, 720, 560, 's1b', 0.7) +
    ell(2050, 980, 760, 640, 's1c', 0.55) +
    ell(980, 1080, 900, 560, 's1d', 0.8) +
    ell(1340, 620, 520, 460, 's1a', 0.35) +
    `<rect width="${W}" height="${H}" fill="url(#s1vig)"/>`;
  return svgShell(defs, body);
}

// ─────────────────────────────────────────────────────────────────────────
// S2 — Connected intelligence. Diptych: Signal rings (L) meet Nexus mesh (R),
// joined by a luminous seam down the centre.
// ─────────────────────────────────────────────────────────────────────────
function s2() {
  const rnd = lcg(20406);
  const cxL = 640, cyL = 690, cxR = 1820, cyR = 660;

  let rings = '';
  for (let i = 1; i <= 7; i++) {
    const r = 120 + i * 95;
    rings += `<circle cx="${cxL}" cy="${cyL}" r="${r}" fill="none" stroke="${COBALT}" stroke-width="${(2.4 - i * 0.18).toFixed(2)}" opacity="${(0.5 - i * 0.05).toFixed(3)}"/>`;
  }
  rings += `<circle cx="${cxL}" cy="${cyL}" r="34" fill="url(#s2core)"/>`;

  // Nexus node mesh on the right.
  const nodes = [];
  for (let i = 0; i < 16; i++) {
    nodes.push([cxR + (rnd() - 0.5) * 760, cyR + (rnd() - 0.5) * 760]);
  }
  let mesh = '';
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0], dy = nodes[i][1] - nodes[j][1];
      if (Math.hypot(dx, dy) < 320) {
        mesh += `<line x1="${nodes[i][0].toFixed(0)}" y1="${nodes[i][1].toFixed(0)}" x2="${nodes[j][0].toFixed(0)}" y2="${nodes[j][1].toFixed(0)}" stroke="${NODE}" stroke-width="1.4" opacity="0.22"/>`;
      }
    }
  }
  for (const [x, y] of nodes) {
    mesh += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(5 + rnd() * 7).toFixed(1)}" fill="${NODE}" opacity="0.85"/>`;
  }

  const defs =
    baseRadial('s2base', '#13265a', NAVY, NAVY_DEEP, '50%', '42%', '95%') +
    glow('s2gl', COBALT, 0.5) + glow('s2gr', SKY, 0.42) + glow('s2core', COBALT_HOT, 0.95) +
    `<linearGradient id="s2seam" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="${COBALT_HOT}" stop-opacity="0"/>` +
    `<stop offset="50%" stop-color="${COBALT_HOT}" stop-opacity="0.5"/>` +
    `<stop offset="100%" stop-color="${COBALT_HOT}" stop-opacity="0"/></linearGradient>` +
    vignette('s2vig', NAVY_ABYSS, 0.7);
  const body =
    `<rect width="${W}" height="${H}" fill="url(#s2base)"/>` +
    ell(cxL, cyL, 620, 560, 's2gl', 0.8) +
    ell(cxR, cyR, 640, 560, 's2gr', 0.7) +
    rings + mesh +
    `<rect x="${W / 2 - 130}" y="0" width="260" height="${H}" fill="url(#s2seam)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#s2vig)"/>`;
  return svgShell(defs, body);
}

// ─────────────────────────────────────────────────────────────────────────
// S3 — More than monitoring. Scattered alerts (L) converge into a verified
// constellation (R).
// ─────────────────────────────────────────────────────────────────────────
function s3() {
  const rnd = lcg(7714);
  const hub = [1720, 680];

  // Scattered loose alerts on the left third.
  let alerts = '';
  const alertPts = [];
  for (let i = 0; i < 34; i++) {
    const x = 120 + rnd() * 760, y = 160 + rnd() * 1040;
    alertPts.push([x, y]);
    const r = 4 + rnd() * 9;
    alerts += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${COBALT}" opacity="${(0.15 + rnd() * 0.4).toFixed(3)}"/>`;
  }

  // Organised constellation on the right.
  const stars = [];
  for (let i = 0; i < 11; i++) {
    const a = (Math.PI * 2 * i) / 11 + rnd() * 0.4;
    const rad = 150 + rnd() * 250;
    stars.push([hub[0] + Math.cos(a) * rad, hub[1] + Math.sin(a) * rad * 0.9]);
  }
  let constellation = '';
  for (const [x, y] of stars) {
    constellation += `<line x1="${hub[0]}" y1="${hub[1]}" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}" stroke="${NODE}" stroke-width="1.4" opacity="0.3"/>`;
  }
  for (let i = 0; i < stars.length; i++) {
    const n = stars[(i + 1) % stars.length];
    constellation += `<line x1="${stars[i][0].toFixed(0)}" y1="${stars[i][1].toFixed(0)}" x2="${n[0].toFixed(0)}" y2="${n[1].toFixed(0)}" stroke="${NODE}" stroke-width="1" opacity="0.16"/>`;
  }
  for (const [x, y] of stars) {
    constellation += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="7" fill="${NODE}" opacity="0.9"/>`;
  }
  // Faint convergence streams from a few alerts toward the hub.
  let streams = '';
  for (let i = 0; i < 7; i++) {
    const p = alertPts[i * 4];
    streams += `<path d="M ${p[0].toFixed(0)} ${p[1].toFixed(0)} Q ${(p[0] + hub[0]) / 2} ${(p[1] + hub[1]) / 2 - 120} ${hub[0]} ${hub[1]}" fill="none" stroke="${COBALT}" stroke-width="1.2" opacity="0.12"/>`;
  }
  const verified =
    `<polygon points="${hex(hub[0], hub[1], 46)}" fill="url(#s3core)" stroke="${NODE}" stroke-width="2.5" opacity="0.95"/>` +
    `<polygon points="${hex(hub[0], hub[1], 78)}" fill="none" stroke="${COBALT}" stroke-width="2" opacity="0.4"/>`;

  const defs =
    baseRadial('s3base', '#101f48', NAVY, NAVY_DEEP, '64%', '46%', '95%') +
    glow('s3hub', COBALT, 0.55) + glow('s3core', COBALT_HOT, 0.95) +
    vignette('s3vig', NAVY_ABYSS, 0.72);
  const body =
    `<rect width="${W}" height="${H}" fill="url(#s3base)"/>` +
    ell(hub[0], hub[1], 600, 540, 's3hub', 0.85) +
    streams + alerts + constellation + verified +
    `<rect width="${W}" height="${H}" fill="url(#s3vig)"/>`;
  return svgShell(defs, body);
}

// ─────────────────────────────────────────────────────────────────────────
// S4 — Verified intelligence for faster decisions. Accelerating signal path
// sweeping L→R into a verified hex node — forward momentum / speed.
// ─────────────────────────────────────────────────────────────────────────
function s4() {
  const rnd = lcg(33190);
  const target = [1880, 700];
  let streaks = '';
  for (let i = 0; i < 26; i++) {
    const y = 140 + (i / 26) * 1070 + (rnd() - 0.5) * 30;
    const x0 = rnd() * 360;
    const len = 420 + rnd() * 900;
    const op = (0.06 + rnd() * 0.26).toFixed(3);
    const w = (1 + rnd() * 2.4).toFixed(2);
    streaks += `<line x1="${x0.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x0 + len).toFixed(0)}" y2="${(y - 26).toFixed(0)}" stroke="url(#s4streak)" stroke-width="${w}" opacity="${op}"/>`;
  }
  // A few accelerating "comet" dots toward the node.
  let comets = '';
  for (let i = 0; i < 9; i++) {
    const t = rnd();
    const x = 700 + t * 1000, y = 360 + rnd() * 700;
    comets += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2 + rnd() * 4).toFixed(1)}" fill="${NODE}" opacity="${(0.3 + rnd() * 0.5).toFixed(3)}"/>`;
  }
  const node =
    `<polygon points="${hex(target[0], target[1], 60)}" fill="url(#s4core)" stroke="${NODE}" stroke-width="3" opacity="0.95"/>` +
    `<polygon points="${hex(target[0], target[1], 96)}" fill="none" stroke="${COBALT}" stroke-width="2" opacity="0.45"/>` +
    // check mark
    `<path d="M ${target[0] - 26} ${target[1] + 2} l 16 18 l 34 -40" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`;

  const defs =
    baseRadial('s4base', '#12275a', NAVY, NAVY_DEEP, '74%', '50%', '100%') +
    glow('s4n', COBALT, 0.5) + glow('s4core', COBALT_HOT, 0.95) +
    `<linearGradient id="s4streak" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0%" stop-color="${SKY}" stop-opacity="0"/>` +
    `<stop offset="70%" stop-color="${COBALT_HOT}" stop-opacity="0.8"/>` +
    `<stop offset="100%" stop-color="#ffffff" stop-opacity="1"/></linearGradient>` +
    vignette('s4vig', NAVY_ABYSS, 0.74);
  const body =
    `<rect width="${W}" height="${H}" fill="url(#s4base)"/>` +
    ell(target[0], target[1], 620, 560, 's4n', 0.85) +
    streaks + comets + node +
    `<rect width="${W}" height="${H}" fill="url(#s4vig)"/>`;
  return svgShell(defs, body);
}

// ─────────────────────────────────────────────────────────────────────────
// S5 — Latest resources & news. LIGHT editorial wash — layered "cover" planes
// over a frost field so resource copy stays readable.
// ─────────────────────────────────────────────────────────────────────────
function s5() {
  const defs =
    `<linearGradient id="s5base" x1="0" y1="0" x2="0.4" y2="1">` +
    `<stop offset="0%" stop-color="#ffffff"/>` +
    `<stop offset="60%" stop-color="${FROST}"/>` +
    `<stop offset="100%" stop-color="#e7edf9"/></linearGradient>` +
    glow('s5gl', COBALT, 0.16) +
    `<pattern id="s5dots" width="46" height="46" patternUnits="userSpaceOnUse">` +
    `<circle cx="2" cy="2" r="2" fill="${COBALT}" opacity="0.06"/></pattern>` +
    `<linearGradient id="s5card" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="#ffffff"/>` +
    `<stop offset="100%" stop-color="${FROST}"/></linearGradient>`;

  // Three stacked, offset cover planes on the right — like a fanned set of posts.
  let cards = '';
  const base = [1430, 300, 560, 760];
  const offs = [[150, 120, 0.45], [80, 60, 0.7], [0, 0, 1]];
  for (const [ox, oy, op] of offs) {
    const x = base[0] + ox, y = base[1] + oy;
    cards +=
      `<rect x="${x}" y="${y}" width="${base[2]}" height="${base[3]}" rx="18" fill="url(#s5card)" stroke="#d6dce8" stroke-width="2" opacity="${op}"/>`;
    if (op === 1) {
      // top card detailing: thumb band + text lines
      cards += `<rect x="${x + 36}" y="${y + 36}" width="${base[2] - 72}" height="220" rx="10" fill="url(#s5gl)" stroke="#dde4f3" stroke-width="1.5"/>`;
      cards += `<rect x="${x + 36}" y="${y + 300}" width="${base[2] - 200}" height="20" rx="10" fill="${COBALT}" opacity="0.4"/>`;
      for (let i = 0; i < 4; i++) {
        cards += `<rect x="${x + 36}" y="${y + 348 + i * 40}" width="${base[2] - 90 - i * 50}" height="14" rx="7" fill="#9aa6c2" opacity="0.5"/>`;
      }
    }
  }

  const body =
    `<rect width="${W}" height="${H}" fill="url(#s5base)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#s5dots)"/>` +
    ell(540, 480, 720, 620, 's5gl', 1) +
    cards;
  return svgShell(defs, body);
}

// ─────────────────────────────────────────────────────────────────────────
// S6 — Closing CTA. Modern soundwave visuals — dimmed equalizer bars over
// navy, bracketing the page with the S1 hero.
// ─────────────────────────────────────────────────────────────────────────
function s6() {
  const rnd = lcg(51022);
  const baseY = 760, bars = 76, gap = W / bars;
  let wave = '';
  for (let i = 0; i < bars; i++) {
    const x = i * gap + gap * 0.18;
    const w = gap * 0.5;
    // smooth envelope peaking centre, plus jitter
    const env = Math.sin((i / bars) * Math.PI);
    const h = 60 + env * 520 * (0.55 + rnd() * 0.7);
    const op = (0.18 + env * 0.5).toFixed(3);
    wave += `<rect x="${x.toFixed(1)}" y="${(baseY - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(w / 2).toFixed(1)}" fill="url(#s6bar)" opacity="${op}"/>`;
    // reflection
    wave += `<rect x="${x.toFixed(1)}" y="${baseY.toFixed(1)}" width="${w.toFixed(1)}" height="${(h * 0.4).toFixed(1)}" rx="${(w / 2).toFixed(1)}" fill="url(#s6refl)" opacity="${(op * 0.5).toFixed(3)}"/>`;
  }
  const defs =
    baseRadial('s6base', HALO, NAVY, NAVY_DEEP, '50%', '52%', '95%') +
    glow('s6gl', COBALT, 0.45) +
    `<linearGradient id="s6bar" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>` +
    `<stop offset="35%" stop-color="${COBALT_HOT}" stop-opacity="0.85"/>` +
    `<stop offset="100%" stop-color="${COBALT}" stop-opacity="0.1"/></linearGradient>` +
    `<linearGradient id="s6refl" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="${COBALT}" stop-opacity="0.5"/>` +
    `<stop offset="100%" stop-color="${COBALT}" stop-opacity="0"/></linearGradient>` +
    vignette('s6vig', NAVY_ABYSS, 0.82);
  const body =
    `<rect width="${W}" height="${H}" fill="url(#s6base)"/>` +
    ell(1200, 760, 1000, 520, 's6gl', 0.9) +
    wave +
    `<rect width="${W}" height="${H}" fill="url(#s6vig)"/>`;
  return svgShell(defs, body);
}

const scenes = [
  ['s1-bg', s1()],
  ['s2-bg', s2()],
  ['s3-bg', s3()],
  ['s4-bg', s4()],
  ['s5-bg', s5()],
  ['s6-bg', s6()],
];

for (const [name, svg] of scenes) {
  const out = resolve(OUT, `${name}.png`);
  await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(out);
  console.log('✓', out);
}
console.log('Done —', scenes.length, 'section backgrounds rendered.');
