import type { Config } from 'tailwindcss';

// Design tokens lifted from the Deconflict Brand Color Guide v1.0 so the
// components read with named colours, not scattered hex. White is the field,
// navy the authority, cobalt the single accent; reds/greens/amber are reserved
// status signals. No orange, no pure grays — neutrals lean cool.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Authority & ink — a single navy carries headings, body and dark surfaces.
        ink: '#0D1B3E', // primary text, headings, LE track
        navy: '#0D1B3E', // authority surfaces — sidebar, dark panels, footers
        le: '#0D1B3E', // law-enforcement track
        // Accent — Signal Cobalt is the one interactive accent.
        cobalt: '#1A56DB', // links, CTAs, focus rings
        'cobalt-soft': '#F0F4FF', // selected states, info chips
        fi: '#1A56DB', // financial-institution track = the accent blue
        // Structure & neutrals — cool-leaning, never pure gray.
        frost: '#F4F6FB', // page bands, table stripes
        muted: '#6B7A99', // secondary text, captions, metadata
        subtle: '#B0B8CC', // tertiary text, placeholders, disabled, idle marks
        hair: '#D6DCE8', // hairlines, dividers, input outlines
        'border-soft': '#E8ECF3', // card edges, low-emphasis separators
        // Signal & status — reserved, used sparingly.
        match: '#2F8F5C', // confirmed match / overlap marker (Verified Green)
        success: '#2F8F5C', // confirmed match, audit pass, completed state
        caution: '#A66A00', // pending review, soft warnings (use rarely)
        risk: {
          bg: '#FCEAEA',
          text: '#B91C1C', // Alert Red — active conflict, destructive
        },
        // Highlighted field → brand cobalt-soft (selected / info).
        field: {
          bg: '#F0F4FF',
          border: '#D6E0FF',
        },
        // Caution banner → brand Caution Amber tints.
        alert: {
          bg: '#FBF0D9',
          border: '#EAD9AC',
          icon: '#A66A00',
        },
      },
      fontFamily: {
        // Institutional serif for display headings & the wordmark; Inter for
        // body; IBM Plex Mono for eyebrows, labels and code.
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // Glassmorphic depth — each token bundles an inner top-edge highlight with
      // the outer drop shadow so a single `shadow-*` class reads as frosted glass
      // (multiple shadow utilities can't co-exist; they share one CSS variable).
      boxShadow: {
        glass:
          'inset 0 1px 0 0 rgba(255,255,255,0.70), 0 20px 48px -18px rgba(13,27,62,0.32), 0 6px 16px -8px rgba(13,27,62,0.16)',
        'glass-sm':
          'inset 0 1px 0 0 rgba(255,255,255,0.70), 0 10px 28px -12px rgba(13,27,62,0.24), 0 3px 8px -4px rgba(13,27,62,0.12)',
        'glass-chip':
          'inset 0 1px 0 0 rgba(255,255,255,0.85), 0 8px 20px -6px rgba(13,27,62,0.22), 0 2px 4px -1px rgba(13,27,62,0.10)',
        // Recessed wells — pure inset, no outer drop.
        'field-inset':
          'inset 0 2px 5px -1px rgba(13,27,62,0.12), inset 0 1px 0 0 rgba(255,255,255,0.55)',
        'pill-inset':
          'inset 0 1px 0 0 rgba(255,255,255,0.60), inset 0 -1px 2px 0 rgba(13,27,62,0.08)',
      },
      // Modal/dialog entrances — gated behind motion-safe: at the call site.
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'pop-in': 'pop-in 180ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
