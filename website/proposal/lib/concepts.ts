export type Typeface = {
  role: 'Display' | 'Body' | 'Mono';
  family: string;
  usage: string;
};

export type SignatureElement = {
  name: string;
  description: string;
};

export type SectionNote = {
  id: string;
  title: string;
  note: string;
};

export type Concept = {
  slug: string;
  letter: string;
  name: string;
  tagline: string;
  file: string; // path under /public
  metaphor: string;
  summary: string;
  rationale: string[];
  typefaces: Typeface[];
  colorNotes: string;
  signatureElements: SignatureElement[];
  anatomy: SectionNote[];
  motion: string;
  accessibility: string;
  bestFor: string;
  tradeoffs: string;
};

/** Palette shared by all three concepts (CSS custom properties in each file). */
export const sharedPalette = [
  { token: '--navy', hex: '#0D1B3E', role: 'Foreground / brand navy' },
  { token: '--cobalt', hex: '#1A56DB', role: 'Primary accent, CTAs, verified state' },
  { token: '--cobalt-soft', hex: '#F0F4FF', role: 'Accent wash, selection, halos' },
  { token: '--frost', hex: '#F4F6FB', role: 'Section tint, hover fills' },
  { token: '--muted', hex: '#6B7A99', role: 'Secondary text' },
  { token: '--subtle', hex: '#B0B8CC', role: 'Tertiary text, hairline art' },
  { token: '--border', hex: '#D6DCE8', role: 'Structural rules' },
  { token: '--border-soft', hex: '#E8ECF3', role: 'Soft dividers' },
];

/** Content architecture shared by all three concepts — only the visual language changes. */
export const sharedArchitecture = [
  { id: 'S1', title: 'Hero', note: 'Positioning statement + demo CTA + trust markers (SOC 2 Type II, GDPR, hashed identifier exchange).' },
  { id: 'S2', title: 'The Platform', note: 'NEXUS (operational coordination) and SIGNAL (intelligence signals) presented as the two product halves.' },
  { id: 'S3', title: 'Why Deconflict', note: '“Compliance teams need more than monitoring” — lifecycle: Onboarding → Monitoring → Escalation → Reporting, plus built-for-scale note.' },
  { id: 'S4', title: 'Capabilities', note: 'Three pillars: Law Enforcement Intelligence, Examiner-Ready Compliance, Seamless Integration & Speed.' },
  { id: 'S5', title: 'Resources', note: 'Latest briefings and news (four entries).' },
  { id: 'S6', title: 'Close', note: 'Navy closing panel — “Built for institutions managing digital asset risk” — and footer.' },
];

export const concepts: Concept[] = [
  {
    slug: 'concept-a-dossier',
    letter: 'A',
    name: 'The Dossier',
    tagline: 'Investigative gravitas in an editorial, security-print register.',
    file: '/concepts/concept-a-dossier.html',
    metaphor: 'An intelligence dossier — engraved, credentialed, archival.',
    summary:
      'The most editorial of the three directions. A Spectral serif display face, a generated guilloché rosette (the engraving pattern used on banknotes and certificates), and a fixed lifecycle “spine” give the page the feel of a verified document rather than a SaaS landing page. Authority is communicated through restraint: hairline rules, generous whitespace, and slow, deliberate motion.',
    rationale: [
      'Deconflict sells verified intelligence, so this concept borrows the visual language of instruments whose whole job is to be trusted: banknotes, seals, certificates. The hero’s guilloché rosette is generated in code (36 rotated ellipses plus a nine-lobe rose curve) and rotates once every two minutes — present, but never busy.',
      'The fixed left spine mirrors the compliance lifecycle (Intelligence → Onboarding → Monitoring → Escalation → Reporting) and doubles as a scroll-progress indicator, quietly reinforcing the S3 lifecycle story as the reader moves down the page.',
      'Serif display set in Spectral Light with italic cobalt emphasis (“Investigative Intelligence”) reads as editorial rather than promotional — closer to a briefing than a pitch.',
    ],
    typefaces: [
      { role: 'Display', family: 'Spectral 300–500 (serif)', usage: 'Headlines with italic cobalt <em> accents; product names in the diptych.' },
      { role: 'Body', family: 'Inter 400–600', usage: 'Paragraphs, buttons, navigation.' },
      { role: 'Mono', family: 'IBM Plex Mono 400–500', usage: 'Eyebrows, section indices [ Sec 02 ], spine labels, pillar markers A/B/C.' },
    ],
    colorNotes:
      'Shared palette, plus two semantic extras unique to this concept: --alert #B91C1C and --success #2F8F5C. Cobalt is rationed to italics, rules, and the rosette thread; the page is otherwise near-monochrome navy on white, with frost bands separating sections.',
    signatureElements: [
      { name: 'Lifecycle spine', description: 'Fixed left rail with five stage labels, a live scroll-progress line, and an active-stage dot with cobalt halo. Hidden below 1480px viewports.' },
      { name: 'Guilloché rosette', description: 'JS-generated security-print rosette in the hero (and ghosted in the S6 close), rotating over 120s, with a central seal reading “Verified Intelligence / Operational Advantage”.' },
      { name: 'Diptych product panel', description: 'NEXUS and SIGNAL as two halves of one bordered panel, each with a line-art glyph (node network / pulsing signal rings).' },
      { name: 'Contrast table', description: '“Traditional analytics vs Deconflict” two-column table with struck-through legacy capabilities.' },
      { name: 'Ledger resource list', description: 'Resources as ruled rows (category · title · action) that indent on hover, like entries in a register.' },
    ],
    anatomy: [
      { id: 'S1', title: 'Hero', note: '7/5 asymmetric grid: serif headline left, rotating rosette right. Trust markers sit in a ruled meta row beneath the CTAs.' },
      { id: 'S2', title: 'The Platform', note: 'Bordered diptych; each product half hovers to frost and advances its arrow. Glyphs are 1px line art, not illustrations.' },
      { id: 'S3', title: 'Why Deconflict', note: 'Frost band. Left: lede + strikethrough contrast table. Right: numbered lifecycle stages whose top rules draw in on scroll, plus a cobalt-edged scale note.' },
      { id: 'S4', title: 'Capabilities', note: 'Three ruled pillar columns labelled A — Source, B — Scrutiny, C — Speed, with dash-marked lists.' },
      { id: 'S5', title: 'Resources', note: 'Ledger rows with mono category labels and serif titles.' },
      { id: 'S6', title: 'Close', note: 'Navy panel with a ghosted rosette bleeding off the right edge; white-on-navy CTA.' },
    ],
    motion:
      'The quietest concept. IntersectionObserver reveals (700ms ease-out), the 120s rosette rotation, lifecycle rules that draw to 64px when in view, a 3s ping pulse on the Signal glyph, and the spine progress line tracking scroll. Nothing loops fast; nothing uses canvas.',
    accessibility:
      'prefers-reduced-motion disables the rosette rotation, reveals, and pulses. :focus-visible draws a 2px cobalt outline. The spine is aria-hidden (decorative duplicate of the section flow). Lightest runtime of the three — no canvas, one small generated SVG.',
    bestFor:
      'Audiences that equate gravitas with credibility — banks, regulators, examiners. The right pick if the brand should feel like an institution rather than a startup.',
    tradeoffs:
      'The serif editorial register reads less “product” than B; screenshots feel like a journal, not a dashboard. The spine — its best moment — only appears on wide viewports (>1480px).',
  },
  {
    slug: 'concept-b-signal-path',
    letter: 'B',
    name: 'Signal Path',
    tagline: 'A living network — modern SaaS warmth with the platform as the diagram.',
    file: '/concepts/concept-b-signal-path.html',
    metaphor: 'Signals routed from law enforcement, through Deconflict, to institutions.',
    summary:
      'The most contemporary, product-led direction. A floating pill nav, soft radial gradients, rounded cards, and two live canvas network simulations make the core promise — intelligence flowing from credentialed sources to your team — literally visible. Section 2 rebuilds the platform diagram as an interactive map: NEXUS capability chips and a SIGNAL comparison table wired into a central rotating hub.',
    rationale: [
      'Where A asserts trust and C performs command, B demonstrates the mechanism. The hero canvas runs a two-leg packet simulation — nodes on the left (law enforcement) and right (financial institutions) route pulses through a central hub — so the value proposition animates before a word is read.',
      'The platform map in S2 is the centerpiece: seven NEXUS capability chips and a five-row SIGNAL “traditional → Deconflict” comparison table physically connect to the hub with hairline connectors and cobalt terminal dots. Architecture is shown, not asserted.',
      'S3 carries the narrative as a single SVG sentence: scattered flickering alerts converge through a deconfliction lens and emerge as a connected constellation with one verified (cobalt, check-marked) node — alerts in, investigative context out.',
    ],
    typefaces: [
      { role: 'Display', family: 'Sora 300–600 (geometric sans)', usage: 'Headlines (with a cobalt→navy gradient span in the hero), card titles, hub wordmark.' },
      { role: 'Body', family: 'Inter 400–600', usage: 'Paragraphs, chips, buttons.' },
      { role: 'Mono', family: 'JetBrains Mono 400–500', usage: 'Kickers [ Sec 02 — The Platform ], chip labels, workflow step titles.' },
    ],
    colorNotes:
      'Shared palette deployed at its softest: radial cobalt-soft washes behind the hero and S3, frost gradients inside cards, and cobalt shadows under primary buttons. The only gradient text in the whole proposal set lives in this hero. Large radii throughout (16–28px, pill nav at 99px).',
    signatureElements: [
      { name: 'Floating pill nav', description: 'Detached, blurred, pill-shaped bar floating 16px from the top edge with a shadowed cobalt CTA.' },
      { name: 'Hero network canvas', description: 'Canvas simulation: 7 LE nodes + 7 FI nodes wired to a hub; packets spawn every 900ms and travel two legs (source → hub → opposite side). A second, darker instance runs inside the S6 close panel.' },
      { name: 'Platform map', description: 'Three-column S2 diagram — NEXUS chip stack, central hub (concentric rings + 9s spinning cobalt arc + circular wordmark core), SIGNAL comparison table — joined by connector lines with terminal dots.' },
      { name: 'Workflow strip', description: 'Five dash-connected steps (Onboarding → Monitoring → Escalation → Reporting → Decision-Making) closing the platform panel.' },
      { name: 'Alerts→context illustration', description: 'S3 narrative SVG: flickering alert dots → lens rings around the brand mark → verified constellation, with a packet that travels the full path every 5.5s.' },
    ],
    anatomy: [
      { id: 'S1', title: 'Hero', note: 'Centered, full-viewport, canvas behind. Live chip (“For Compliance & Risk Teams”), gradient headline span, mono trust markers as a quiet footer row.' },
      { id: 'S2', title: 'The Platform', note: 'The platform map panel (see signature elements) — the densest, most informative S2 of the three concepts. Both product columns are links.' },
      { id: 'S3', title: 'Why Deconflict', note: 'Frost band with radial wash. Two-column lede, then the alerts→context SVG, then a built-for-scale strip.' },
      { id: 'S4', title: 'Capabilities', note: 'Three rounded cards with icon tiles; hover lifts the card and lights a gradient hairline along its top edge.' },
      { id: 'S5', title: 'Resources', note: 'Four equal cards in a row; hover lifts and recolors the border cobalt.' },
      { id: 'S6', title: 'Close', note: 'Rounded navy panel (not full-bleed) with its own network canvas at 50% opacity behind the CTA.' },
    ],
    motion:
      'The richest motion budget: two requestAnimationFrame canvas loops, the spinning hub arc (9s), flickering alert dots, the 5.5s traveling packet, blinking live-chip dot, and hover lifts with shadow growth. All loops idle out under reduced motion.',
    accessibility:
      'prefers-reduced-motion stops packet spawning, the hub arc, flicker, and reveals. The S3 illustration carries role="img" with a full aria-label describing the alerts→context story. Heaviest runtime of the three — two persistent canvas animations.',
    bestFor:
      'Fintech-native buyers who expect modern SaaS polish; demo-generation landing pages; teams that want the product mechanism explained visually above the fold.',
    tradeoffs:
      'Softer authority than A or C — friendliness costs some institutional weight. Two canvas loops are the largest performance footprint, and the S2 map needs its ≤1180px single-column fallback (connectors hidden) on smaller screens.',
  },
  {
    slug: 'concept-c-command',
    letter: 'C',
    name: 'Command',
    tagline: 'A command-center register — condensed, uppercase, operational.',
    file: '/concepts/concept-c-command.html',
    metaphor: 'The operations room: dot-matrix map, scan sweep, chain of custody.',
    summary:
      'The most assertive direction. A full-viewport navy hero carries a dot-matrix “landmass” canvas and a luminous scan line; the headline is a kinetic, two-line condensed-uppercase rise (“INVESTIGATIVE / INTELLIGENCE.”) at up to 128px. Products become call signs (DC / NX, DC / SG), the lifecycle becomes a chain-of-custody board whose ticks light in sequence, and resources arrive as a numbered wire feed.',
    rationale: [
      'Deconflict’s differentiation is law-enforcement adjacency, and C leans all the way in: the visual register is the briefing room, not the marketing site. Bottom-anchored hero composition, hairline grids, and mono codes everywhere signal operational seriousness.',
      'The chain-of-custody board (S3) reframes the same four lifecycle stages as evidence handling — each navy cell carries a Stage ID and a tick that lights cobalt in 260ms sequence when scrolled into view, implying continuity and auditability.',
      'Typography does most of the work: Barlow Semi Condensed at 600, uppercase, with the second hero line dimmed to periwinkle. Restraint elsewhere (IBM Plex Sans body, two-color scheme) keeps the volume controlled.',
    ],
    typefaces: [
      { role: 'Display', family: 'Barlow Semi Condensed 400–600', usage: 'Uppercase headlines (56–128px clamp), product names at 64px, uppercase CTAs.' },
      { role: 'Body', family: 'IBM Plex Sans 400–600', usage: 'Paragraphs and supporting copy — the only concept not using Inter.' },
      { role: 'Mono', family: 'IBM Plex Mono 400–500', usage: 'Call-sign codes (DC / NX), stage IDs, wire numbers 001–004, section indices.' },
    ],
    colorNotes:
      'Shared palette pushed to its darkest deployment: full navy hero, S3 band on --navy-2 #13244E with a 56px grid overlay, navy close. Periwinkle tints (#7E96D8, #9FB0D6, #B7C3E2) carry secondary text on dark. Cobalt appears as glow — scan line, lit ticks — rather than wash. Sharp corners (2px radius) throughout.',
    signatureElements: [
      { name: 'Dot-matrix map hero', description: 'Canvas field of ~thousands of grid dots with density falling toward the edges to suggest a landmass; 6% of dots are larger cobalt “stations” that twinkle.' },
      { name: 'Scan sweep', description: 'A 1px cobalt line with glow that sweeps the full hero every 9s (and the S6 close every 11s).' },
      { name: 'Kinetic rise headline', description: 'Two clipped lines that translate up into view on load, the second delayed 120ms and dimmed.' },
      { name: 'Chain-of-custody board', description: 'Four navy stage cells separated by hairlines; corner ticks light cobalt sequentially (260ms stagger) on scroll into view.' },
      { name: 'Wire feed resources', description: 'Numbered rows (001–004) with mono categories and condensed-uppercase titles, like agency wire dispatches.' },
    ],
    anatomy: [
      { id: 'S1', title: 'Hero', note: 'Bottom-anchored: giant headline left, supporting copy + CTAs right, trust markers as a ruled three-column strip pinned to the hero’s base. Nav is transparent over the map and turns solid navy after 40px of scroll.' },
      { id: 'S2', title: 'The Platform', note: 'Hairline command-split: two white cells on a 2px border grid. Call-sign codes, 64px uppercase product names, slash-prefixed capability lists.' },
      { id: 'S3', title: 'Why Deconflict', note: 'Navy-2 band with grid overlay; lede beside the headline, then the chain-of-custody board and a bordered built-for-scale bar.' },
      { id: 'S4', title: 'Capabilities', note: 'Ledger rows under a 2px navy rule — index (DC-01…03), uppercase title, dash-marked list.' },
      { id: 'S5', title: 'Resources', note: 'The numbered wire feed; rows fill frost on hover with mono “READ →” actions.' },
      { id: 'S6', title: 'Close', note: 'Navy full-bleed with a second scan line drifting behind the CTA.' },
    ],
    motion:
      'Cinematic but sparse: one canvas loop (twinkling map), two CSS scan sweeps, the load-time headline rise, sequential custody ticks, and standard scroll reveals. Reads animated without being busy.',
    accessibility:
      'prefers-reduced-motion hides the scan lines, freezes the map at constant brightness (single drawn frame), removes the headline rise, and lights all custody ticks at once. :focus-visible cobalt outlines throughout. Mid-weight runtime: one canvas loop.',
    bestFor:
      'Maximum differentiation from analytics incumbents; audiences close to the law-enforcement mission; a brand that wants to feel mission-critical rather than friendly.',
    tradeoffs:
      'The most aggressive register — condensed uppercase and dark fields can intimidate conservative compliance buyers. Long titles strain uppercase condensed type, and dark sections demand disciplined photography/illustration if the system grows.',
  },
];

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}

/** Rows for the side-by-side comparison matrix on the index page. */
export const comparison: { dimension: string; values: [string, string, string] }[] = [
  { dimension: 'Register', values: ['Editorial · archival', 'Modern SaaS · product-led', 'Command center · operational'] },
  { dimension: 'Display face', values: ['Spectral (serif)', 'Sora (geometric sans)', 'Barlow Semi Condensed (uppercase)'] },
  { dimension: 'Body / mono', values: ['Inter / IBM Plex Mono', 'Inter / JetBrains Mono', 'IBM Plex Sans / IBM Plex Mono'] },
  { dimension: 'Navigation', values: ['Fixed bar, blurred white', 'Floating pill, detached', 'Transparent → solid navy on scroll'] },
  { dimension: 'Hero device', values: ['Guilloché rosette (SVG)', 'Network packet simulation (canvas)', 'Dot-matrix map + scan line (canvas)'] },
  { dimension: 'Signature moment', values: ['Lifecycle spine + rosette', 'Hub-and-spoke platform map', 'Chain-of-custody light-up'] },
  { dimension: 'Corner radius', values: ['3–6px', '16–28px (pill nav 99px)', '2px'] },
  { dimension: 'Motion budget', values: ['Lightest — no canvas', 'Richest — two canvas loops', 'Mid — one canvas loop + scans'] },
  { dimension: 'Best for', values: ['Institutional gravitas', 'Fintech-native polish', 'Mission-critical differentiation'] },
];
