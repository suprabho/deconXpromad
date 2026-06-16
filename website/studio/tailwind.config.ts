import type { Config } from 'tailwindcss';

// Design tokens lifted verbatim from deconflict-ui-guide.md so the Deconflict
// components read with named colours, not scattered hex.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A2332', // navy — sidebar, LE track, headings
        alert: {
          bg: '#FCE3B4', // amber banner fill
          border: '#F2C879',
          icon: '#B7791F',
        },
        field: {
          bg: '#FDF6E3', // butter-yellow highlighted field
          border: '#EFE0B0',
        },
        match: '#E8941F', // orange — connectors + overlap markers
        le: '#1A2332', // law-enforcement track
        fi: '#2563EB', // financial-institution track
        risk: {
          bg: '#FCEAEA',
          text: '#C0392B',
        },
        muted: '#6B7280',
        hair: '#E5E7EB', // card borders / hairlines
        // Studio chrome (the editor shell, distinct from composition tokens)
        cobalt: '#1A56DB',
        navy: '#0D1B3E',
        frost: '#F4F6FB',
      },
      fontFamily: {
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
