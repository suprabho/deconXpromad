import clsx from 'clsx';
import {
  FilePdfIcon,
  FileDocIcon,
  FileXlsIcon,
  FileImageIcon,
  FileZipIcon,
  FileTextIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  SpinnerGapIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * EncryptedFile — a chat attachment chip for a file exchanged over the secure
 * channel. The headline of the messaging screen: a file-type tile (with a lock
 * badge while sealed), the name + size, and a cipher state line — `encrypted`
 * (at rest), `verifying` (decrypting / checking the signature) or `decrypted`
 * (verified, ready to open). Three surfaces so it reads on a light panel, a
 * frosted well, or inside an accent (self) bubble. Server-renderable.
 * -------------------------------------------------------------------------- */

export type FileKind = 'pdf' | 'doc' | 'sheet' | 'image' | 'archive' | 'data';
export type CipherState = 'encrypted' | 'verifying' | 'decrypted';
/** `onAccent` = sitting on a coloured (self) bubble; the rest are light. */
export type FileSurface = 'light' | 'frost' | 'onAccent';

const KIND: Record<FileKind, { Icon: FileIconType; tint: string; tile: string }> = {
  pdf: { Icon: FilePdfIcon, tint: 'text-risk-text', tile: 'bg-risk-bg/70' },
  doc: { Icon: FileDocIcon, tint: 'text-fi', tile: 'bg-fi/10' },
  sheet: { Icon: FileXlsIcon, tint: 'text-emerald-600', tile: 'bg-emerald-50' },
  image: { Icon: FileImageIcon, tint: 'text-match', tile: 'bg-match/10' },
  archive: { Icon: FileZipIcon, tint: 'text-muted', tile: 'bg-ink/5' },
  data: { Icon: FileTextIcon, tint: 'text-navy', tile: 'bg-ink/5' },
};
// Phosphor icons share a call signature; this alias just types the map above.
type FileIconType = typeof FilePdfIcon;

const SURFACE: Record<FileSurface, { card: string; name: string; sub: string; tile: string }> = {
  light: {
    card: 'border-hair/70 bg-white/80 shadow-glass-chip backdrop-blur-sm',
    name: 'text-ink',
    sub: 'text-muted',
    tile: '',
  },
  frost: {
    card: 'border-hair/60 bg-frost/80',
    name: 'text-ink',
    sub: 'text-muted',
    tile: '',
  },
  onAccent: {
    card: 'border-white/25 bg-white/15 backdrop-blur-sm',
    name: 'text-white',
    sub: 'text-white/70',
    tile: 'bg-white/15 text-white',
  },
};

function StateLine({ state, surface }: { state: CipherState; surface: FileSurface }) {
  const dim = surface === 'onAccent';
  if (state === 'verifying') {
    return (
      <span className={clsx('inline-flex items-center gap-1', dim ? 'text-white/80' : 'text-fi')}>
        <SpinnerGapIcon weight="bold" className="h-3 w-3 motion-safe:animate-spin" aria-hidden />
        Decrypting…
      </span>
    );
  }
  if (state === 'decrypted') {
    return (
      <span className={clsx('inline-flex items-center gap-1', dim ? 'text-white/80' : 'text-emerald-600')}>
        <ShieldCheckIcon weight="fill" className="h-3 w-3" aria-hidden />
        Verified
      </span>
    );
  }
  return (
    <span className={clsx('inline-flex items-center gap-1', dim ? 'text-white/70' : 'text-muted')}>
      <LockKeyIcon weight="fill" className="h-3 w-3" aria-hidden />
      Encrypted
    </span>
  );
}

export function EncryptedFile({
  name,
  size,
  kind = 'pdf',
  state = 'encrypted',
  meta,
  surface = 'light',
  className,
}: {
  name: string;
  /** Human size, e.g. "2.4 MB". */
  size: string;
  kind?: FileKind;
  state?: CipherState;
  /** Extra detail after the size — page count, cipher ("AES-256-GCM"), key id. */
  meta?: string;
  surface?: FileSurface;
  className?: string;
}) {
  const k = KIND[kind];
  const s = SURFACE[surface];
  const onAccent = surface === 'onAccent';
  const Icon = k.Icon;

  const stateLabel =
    state === 'verifying' ? 'decrypting' : state === 'decrypted' ? 'verified' : 'encrypted';

  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-xl border px-3 py-2.5',
        s.card,
        className
      )}
      role="group"
      aria-label={`${name}, ${size}, ${stateLabel}`}
    >
      <span className="relative shrink-0">
        <span
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            onAccent ? s.tile : k.tile
          )}
        >
          <Icon weight="duotone" className={clsx('h-5 w-5', onAccent ? 'text-white' : k.tint)} aria-hidden />
        </span>
        {state === 'encrypted' && (
          <span
            aria-hidden
            className={clsx(
              'absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2',
              onAccent ? 'bg-white text-ink ring-fi' : 'bg-match text-white ring-white'
            )}
          >
            <LockKeyIcon weight="fill" className="h-2.5 w-2.5" />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className={clsx('truncate text-sm font-semibold', s.name)}>{name}</p>
        <p className={clsx('mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px]', s.sub)}>
          <span className="tabular-nums">{size}</span>
          {meta && (
            <>
              <span aria-hidden>·</span>
              <span>{meta}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <StateLine state={state} surface={surface} />
        </p>
      </div>

      <button
        type="button"
        aria-label={`${state === 'decrypted' ? 'Download' : 'Decrypt and download'} ${name}`}
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
          onAccent
            ? 'text-white/80 hover:bg-white/20 hover:text-white'
            : 'text-muted hover:bg-ink/5 hover:text-ink'
        )}
      >
        <DownloadSimpleIcon weight="bold" className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
