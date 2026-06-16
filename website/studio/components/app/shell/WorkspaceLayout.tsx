import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * WorkspaceLayout — the structural grid of Screen 1: an optional primary rail,
 * an optional secondary nav column, and the main content well, all sitting on
 * the frost backdrop. A header band spans the content column. Purely structural
 * (slots only) so it composes with any Sidebar / NavTree / Panel content.
 * -------------------------------------------------------------------------- */

export function WorkspaceLayout({
  rail,
  nav,
  header,
  children,
  className,
}: {
  /** Primary left sidebar (e.g. <Sidebar>). */
  rail?: ReactNode;
  /** Secondary navigation column (e.g. <NavTree>). */
  nav?: ReactNode;
  /** Top header band spanning the content column. */
  header?: ReactNode;
  /** Main content well. */
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex gap-4 rounded-3xl bg-frost p-4', className)}>
      {rail && <aside className="hidden shrink-0 lg:block">{rail}</aside>}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {header}
        <div className="flex min-h-0 flex-1 gap-4">
          {nav && <aside className="hidden shrink-0 md:block">{nav}</aside>}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
