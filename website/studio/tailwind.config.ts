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
    },
  },
  plugins: [],
} satisfies Config;
