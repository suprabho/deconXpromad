import clsx from 'clsx';
import { StatusDot, type StatusTone } from './StatusDot';

/* -------------------------------------------------------------------------- *
 * Avatar — circular identity chip. Renders an image when `src` is given, else
 * derives up-to-two initials from `name`. Optional presence dot (bottom-right)
 * powers the top-bar account glyph and search-result badges.
 *
 * Server-renderable. Uses a plain <img> (the studio exports static PNGs and
 * has no next/image loader wired for arbitrary remote hosts).
 * -------------------------------------------------------------------------- */

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  src,
  size = 'md',
  presence,
  className,
}: {
  name: string;
  src?: string;
  size?: keyof typeof SIZES;
  /** Presence dot tone; omit for none. */
  presence?: StatusTone;
  className?: string;
}) {
  return (
    <span className={clsx('relative inline-flex shrink-0', className)}>
      <span
        className={clsx(
          'inline-flex items-center justify-center overflow-hidden rounded-full',
          'border border-white/60 bg-frost font-semibold text-ink shadow-glass-chip',
          SIZES[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden>{initials(name)}</span>
        )}
        <span className="sr-only">{name}</span>
      </span>
      {presence && (
        <StatusDot
          tone={presence}
          size="sm"
          className="absolute -bottom-0.5 -right-0.5"
          label={`${name} ${presence}`}
        />
      )}
    </span>
  );
}
