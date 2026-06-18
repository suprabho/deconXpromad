import type { ReactNode } from 'react';
import clsx from 'clsx';
import {
  ShieldCheckIcon,
  LockKeyIcon,
  PaperclipIcon,
  PaperPlaneTiltIcon,
  DotsThreeVerticalIcon,
  KeyIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Avatar } from '../primitives/Avatar';
import { IconButton } from '../primitives/IconButton';
import { Button } from '../primitives/Button';
import { EncryptedFile } from './EncryptedFile';
import {
  ChatMessage,
  type ChatAttachment,
  type ChatTrack,
  type DeliveryStatus,
} from './ChatMessage';

/* -------------------------------------------------------------------------- *
 * SecureChat — a back-and-forth secure messaging panel for cross-institution
 * coordination: an identity header, an end-to-end-encryption banner, a threaded
 * transcript (peer left / self right, consecutive turns grouped) carrying
 * EncryptedFile attachments, and a composer whose staged files are encrypted on
 * device before send. Data-driven and server-renderable — participants resolve
 * by id, layout is deterministic, interactivity is props + optional callbacks.
 * -------------------------------------------------------------------------- */

export type Participant = {
  id: string;
  name: string;
  /** Institution / agency line under the name. */
  org?: string;
  /** `self` is the local party (right, accent bubbles); `peer` is everyone else. */
  side: 'self' | 'peer';
  avatarSrc?: string;
  /** Coordination lane — tints this party's bubbles. */
  track?: ChatTrack;
  online?: boolean;
};

export type MessageItem = {
  kind?: 'message';
  id: string;
  authorId: string;
  body?: ReactNode;
  time?: ReactNode;
  attachments?: ChatAttachment[];
  /** Delivery receipt — applied to the local party's messages only. */
  status?: DeliveryStatus;
};

/** A centred notice — key exchange, verification, joins. */
export type SystemItem = { kind: 'system'; id: string; label: ReactNode; icon?: ReactNode };
/** A centred date separator. */
export type DayItem = { kind: 'day'; id: string; label: ReactNode };

export type ChatItem = MessageItem | SystemItem | DayItem;

function SystemNotice({ label, icon }: { label: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex justify-center px-4">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-[11px] font-medium text-muted shadow-pill-inset backdrop-blur-sm">
        <span className="text-fi" aria-hidden>
          {icon ?? <LockKeyIcon weight="fill" className="h-3 w-3" />}
        </span>
        {label}
      </span>
    </div>
  );
}

function DayDivider({ label }: { label: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <span className="h-px flex-1 bg-hair/70" aria-hidden />
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <span className="h-px flex-1 bg-hair/70" aria-hidden />
    </div>
  );
}

export function SecureChat({
  title,
  subtitle,
  participants,
  items,
  composer = true,
  composerPlaceholder = 'Write a secure message…',
  draftAttachments,
  encryptionNote,
  cipherLabel = 'AES-256-GCM',
  className,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  participants: Participant[];
  items: ChatItem[];
  /** Show the bottom composer. */
  composer?: boolean;
  composerPlaceholder?: string;
  /** Files staged in the composer — shown as sealed chips above the input. */
  draftAttachments?: ChatAttachment[];
  /** Override the encryption-banner copy. */
  encryptionNote?: ReactNode;
  cipherLabel?: ReactNode;
  className?: string;
}) {
  const byId = new Map(participants.map((p) => [p.id, p]));
  const peers = participants.filter((p) => p.side === 'peer');

  const defaultNote =
    encryptionNote ??
    (peers.length > 0 ? (
      <>
        Messages and files are end-to-end encrypted — only{' '}
        <span className="font-semibold text-ink">
          {peers.map((p) => p.org ?? p.name).join(' and ')}
        </span>{' '}
        can read this thread.
      </>
    ) : (
      'Messages and files are end-to-end encrypted.'
    ));

  // Group consecutive turns from the same author; reset across non-message items.
  let lastAuthor: string | null = null;

  return (
    <section
      className={clsx(
        'flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl',
        className
      )}
      aria-label="Secure conversation"
    >
      {/* identity header */}
      <header className="flex items-center gap-3 border-b border-hair/60 bg-white/50 px-5 py-3.5">
        <div className="flex -space-x-2" aria-hidden>
          {peers.slice(0, 3).map((p) => (
            <span key={p.id} className="ring-2 ring-white rounded-full">
              <Avatar name={p.name} src={p.avatarSrc} size="sm" presence={p.online ? 'ok' : undefined} />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          {title && <h2 className="truncate font-serif text-[15px] font-semibold text-ink">{title}</h2>}
          {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
        </div>
        <span className="hidden items-center gap-1.5 rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success shadow-pill-inset sm:inline-flex">
          <ShieldCheckIcon weight="fill" className="h-3.5 w-3.5" aria-hidden />
          Encrypted
        </span>
        <IconButton
          icon={<DotsThreeVerticalIcon weight="bold" className="h-5 w-5" />}
          label="Conversation options"
          size="sm"
        />
      </header>

      {/* encryption banner */}
      <div className="flex items-start gap-2 border-b border-hair/60 bg-fi/[0.06] px-5 py-2.5">
        <LockKeyIcon weight="fill" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fi" aria-hidden />
        <p className="text-[11px] leading-relaxed text-muted">{defaultNote}</p>
      </div>

      {/* transcript */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-frost/40 px-4 py-5">
        {items.map((item) => {
          if (item.kind === 'day') {
            lastAuthor = null;
            return <DayDivider key={item.id} label={item.label} />;
          }
          if (item.kind === 'system') {
            lastAuthor = null;
            return <SystemNotice key={item.id} label={item.label} icon={item.icon} />;
          }

          const author = byId.get(item.authorId);
          const out = author?.side === 'self';
          const grouped = lastAuthor === item.authorId;
          lastAuthor = item.authorId;

          return (
            <ChatMessage
              key={item.id}
              side={out ? 'out' : 'in'}
              track={author?.track ?? 'fi'}
              grouped={grouped}
              author={!out ? author?.name : undefined}
              org={!out ? author?.org : undefined}
              avatar={
                !out && author ? (
                  <Avatar name={author.name} src={author.avatarSrc} size="sm" />
                ) : undefined
              }
              time={item.time}
              status={out ? item.status : undefined}
              attachments={item.attachments}
            >
              {item.body}
            </ChatMessage>
          );
        })}
      </div>

      {/* composer */}
      {composer && (
        <div className="border-t border-hair/60 bg-white/50 px-4 py-3">
          {draftAttachments && draftAttachments.length > 0 && (
            <div className="mb-2.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-fi">
                <KeyIcon weight="fill" className="h-3 w-3" aria-hidden />
                Encrypting {draftAttachments.length} {draftAttachments.length === 1 ? 'file' : 'files'} with{' '}
                {cipherLabel} before send
              </div>
              {draftAttachments.map((a) => (
                <EncryptedFile
                  key={a.id}
                  name={a.name}
                  size={a.size}
                  kind={a.kind}
                  state={a.state ?? 'encrypted'}
                  meta={a.meta}
                  surface="frost"
                />
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <IconButton
              icon={<PaperclipIcon weight="bold" className="h-5 w-5" />}
              label="Attach an encrypted file"
              variant="frost"
            />
            <div className="flex flex-1 items-center rounded-xl border border-white/60 bg-white/70 px-3 shadow-field-inset backdrop-blur-sm focus-within:border-fi/40">
              <input
                type="text"
                placeholder={composerPlaceholder}
                className="h-10 w-full bg-transparent text-sm text-ink placeholder:text-muted/70 focus:outline-none"
                aria-label="Message"
              />
            </div>
            <Button variant="primary" leftIcon={<PaperPlaneTiltIcon weight="fill" className="h-4 w-4" />}>
              Send
            </Button>
          </div>

          <p className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-muted">
            <LockKeyIcon weight="fill" className="h-3 w-3 text-muted/70" aria-hidden />
            Files are encrypted on your device before they leave it.
          </p>
        </div>
      )}
    </section>
  );
}
