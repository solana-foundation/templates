import { cn } from '@tuwaio/sdk/nova-core/utils';

/** A label: small monospace capitals with spacing. */
export const labelClassName = 'font-mono text-[11px] leading-4 font-bold tracking-[0.12em] uppercase';

/** A chip beside a label (a network, a count): a frame of 1px around small monospace capitals. */
export const chipClassName = cn(
  labelClassName,
  'border border-[var(--tuwa-border-strong)] px-1.5 py-0.5 text-[var(--tuwa-text-secondary)]',
);

/** The size and the label of a button of the app; the colours of a `TxActionButton` are those of Nova. */
export const actionClassName =
  'min-h-12 w-full px-4 text-xs font-bold tracking-[0.12em] uppercase disabled:cursor-not-allowed disabled:opacity-50';

/** The idle state of a secondary `TxActionButton`: no fill, a frame of 1px (pass it as `classNames.idle`). */
export const secondaryActionClassName =
  'border border-[var(--tuwa-border-strong)] bg-transparent text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-standart-button-hover)]';
