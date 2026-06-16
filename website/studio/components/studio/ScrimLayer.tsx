import type { ScrimConfig } from '@/lib/composition/types';

function hexToRgba(hex: string, alpha: number): string {
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** z-1 legibility wash behind the foreground / overlay copy. */
export function ScrimLayer({ scrim }: { scrim: ScrimConfig }) {
  if (!scrim.amount) return null;
  const c = scrim.color ?? '#0D1B3E';
  const strong = hexToRgba(c, scrim.amount);
  const fade = hexToRgba(c, 0);

  let background: string;
  switch (scrim.direction) {
    case 'top':
      background = `linear-gradient(to bottom, ${strong} 0%, ${fade} 62%)`;
      break;
    case 'bottom':
      background = `linear-gradient(to top, ${strong} 0%, ${fade} 62%)`;
      break;
    case 'left':
      background = `linear-gradient(to right, ${strong} 0%, ${fade} 62%)`;
      break;
    case 'right':
      background = `linear-gradient(to left, ${strong} 0%, ${fade} 62%)`;
      break;
    case 'radial':
      background = `radial-gradient(circle at center, ${fade} 28%, ${strong} 100%)`;
      break;
    case 'full':
    default:
      background = strong;
  }

  return <div className="absolute inset-0 z-[1]" style={{ background, pointerEvents: 'none' }} />;
}
