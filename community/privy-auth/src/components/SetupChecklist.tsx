import { cn } from '@/lib/utils';

const steps = [
  { done: true,  text: 'Create a Privy account at privy.io' },
  { done: true,  text: 'Add NEXT_PUBLIC_PRIVY_APP_ID to .env.local' },
  { done: false, text: 'Enable social providers in the Privy dashboard' },
];

export default function SetupChecklist({ className }: { className?: string }) {
  return (
    <div className={cn('card p-6 space-y-4', className)}>
      <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
        Setup Checklist
      </h2>
      <ul className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 size-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                ${step.done
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-white/20 border border-white/10'
                }`}
            >
              {step.done ? '✓' : i + 1}
            </span>
            <span className={`text-sm leading-relaxed ${step.done ? 'text-white/40 line-through' : 'text-white/70'}`}>
              {step.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
