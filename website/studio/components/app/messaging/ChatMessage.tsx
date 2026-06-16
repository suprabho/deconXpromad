import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CheckIcon, ChecksIcon, LockSimpleIcon } from '@phosphor-icons/react/dist/ssr';
import { EncryptedFile, type CipherState, type FileKind } from './EncryptedFile';

/* -------------------------------------------------------------------------- *
 * ChatMessage — one turn in the secure thread. `side="out"` is the local party
 * (right-aligned, accent bubble); `side="in"` is the peer (left-aligned, frosted
 * bubble) and carries the avatar + author label. Each bubble can hold body text
 * and a stack of EncryptedFile attachments; outgoing bubbles get a delivery
 * receipt (sent · delivered · read) next to the timestamp. Server-renderable.
 *
 * Driven by data, not refs — SecureChat groups consecutive turns and passes
 * `grouped` to drop the repeated avatar/author. Track tints the in-bubble accent
 * for the two coordination lanes (`fi` financial, `le` law-enforcement).
 * -------------------------------------------------------------------------- */

export type ChatSide = 'in' | 'out';
export type ChatTrack = 'fi' | 'le';
export type DeliveryStatus = 'sent' | 'delivered' | 'read';

export type ChatAttachment = {
  id: string;
  name: string;
  size: string;
  kind?: FileKind;
  state?: CipherState;
  meta?: string;
};

function Receipt({ status }: { status: DeliveryStatus }) {
  if (status === 'sent') {
    return <CheckIcon weight="bold" className="h-3.5 w-3.5 text-muted" aria-label="sent" />;
  }
  const read = status === 'read';
  return (
    <ChecksIcon
      weight="bold"
      className={clsx('h-3.5 w-3.5', read ? 'text-fi' : 'text-muted')}
      aria-label={read ? 'read' : 'delivered'}
    />
  );
}

export function ChatMessage({
  side = 'in',
  author,
  org,
  avatar,
  time,
  status,
  track = 'fi',
  grouped = false,
  attachments,
  children,
  className,
}: {
  side?: ChatSide;
  /** Peer display name shown above the first bubble of a group. */
  author?: ReactNode;
  /** Small institution label next to the author. */
  org?: ReactNode;
  /** Identity chip (e.g. <Avatar/>) — peer side only. */
  avatar?: ReactNode;
  time?: ReactNode;
  /** Delivery receipt — outgoing messages only. */
  status?: DeliveryStatus;
  track?: ChatTrack;
  /** Part of a run from the same author — hide the avatar/author header. */
  grouped?: boolean;
  attachments?: ChatAttachment[];
  children?: ReactNode;
  className?: string;
}) {
  const out = side === 'out';
  const accent = track === 'le' ? 'bg-le' : 'bg-fi';

  const bubble = out
    ? clsx(accent, 'text-white rounded-br-md')
    : 'border border-white/60 bg-white/85 text-ink shadow-glass-chip backdrop-blur-sm rounded-bl-md';

  const hasBody = children != null && children !== '';

  return (
    <div className={clsx('flex w-full gap-2.5', out ? 'flex-row-reverse' : 'flex-row', className)}>
      {/* avatar gutter — keeps bubbles aligned even when grouped/outgoing */}
      <div className="w-8 shrink-0">
        {!out && !grouped && avatar}
      </div>

      <div className={clsx('flex min-w-0 max-w-[80%] flex-col gap-1 sm:max-w-md', out && 'items-end')}>
        {!grouped && (author || org) && (
          <div className={clsx('flex items-baseline gap-1.5 px-1', out && 'flex-row-reverse')}>
            {author && <span className="text-xs font-semibold text-ink">{author}</span>}
            {org && <span className="text-[11px] text-muted">{org}</span>}
          </div>
        )}

        <div className={clsx('w-full rounded-2xl px-3.5 py-2.5', bubble)}>
          {hasBody && (
            <p className={clsx('whitespace-pre-line text-sm leading-relaxed', out ? 'text-white' : 'text-ink')}>
              {children}
            </p>
          )}

          {attachments && attachments.length > 0 && (
            <div className={clsx('space-y-1.5', hasBody && 'mt-2')}>
              {attachments.map((a) => (
                <EncryptedFile
                  key={a.id}
                  name={a.name}
                  size={a.size}
                  kind={a.kind}
                  state={a.state}
                  meta={a.meta}
                  surface={out ? 'onAccent' : 'frost'}
                />
              ))}
            </div>
          )}
        </div>

        {(time || (out && status)) && (
          <div className={clsx('flex items-center gap-1 px-1 text-[11px] text-muted', out && 'flex-row-reverse')}>
            <LockSimpleIcon weight="fill" className="h-3 w-3 text-muted/70" aria-label="end-to-end encrypted" />
            {time && <span className="tabular-nums">{time}</span>}
            {out && status && <Receipt status={status} />}
          </div>
        )}
      </div>
    </div>
  );
}
