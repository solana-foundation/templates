import { cn } from '@tuwaio/sdk/nova-core/utils';
import type { ReactNode } from 'react';

import { labelClassName } from '@/components/classNames';

/**
 * A part of the page in a frame of 1px, with a bar that names it: no shadow, no round corner.
 */
export function Panel({
  name,
  aside,
  footer,
  className,
  children,
}: {
  /** The name of the part, shown in the bar */
  name: string;
  /** What stands at the end of the bar, for example a chip with the network */
  aside?: ReactNode;
  /** A line under the content, for example where the app comes from */
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn('w-full border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)]', className)}>
      <header className="flex min-h-11 items-center justify-between gap-3 border-b border-[var(--tuwa-border-primary)] px-5 py-2.5">
        <p className={cn(labelClassName, 'flex items-center gap-2 text-[var(--tuwa-text-primary)]')}>
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--tuwa-text-primary)]" />
          {name}
        </p>
        {aside}
      </header>
      {children}
      {footer && (
        <footer
          className={cn(
            labelClassName,
            'border-t border-[var(--tuwa-border-primary)] px-5 py-3 text-[var(--tuwa-text-secondary)]',
          )}
        >
          {footer}
        </footer>
      )}
    </section>
  );
}

/** Where the app comes from: the footer of a panel. */
export function PoweredBy() {
  return (
    <>
      Powered by{' '}
      <a
        href="https://github.com/TuwaIO"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--tuwa-text-primary)] underline underline-offset-4 hover:no-underline"
      >
        TUWA
      </a>{' '}
      · Web3 transaction tracking
    </>
  );
}
