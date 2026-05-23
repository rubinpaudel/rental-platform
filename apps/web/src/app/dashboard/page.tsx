import { DashboardGreeting } from '@/features/dashboard/dashboard-greeting';

// Intentionally an empty shell in v2a — listing/inbox land in later milestones.
export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <DashboardGreeting />
      <div className="h-px w-full origin-left bg-line rule-grow" />
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line-strong bg-paper-raised/50 px-8 py-24 text-center">
        <span className="font-display text-[3.5rem] leading-none text-line-strong">—</span>
        <p className="mt-6 font-display text-[1.35rem] font-medium tracking-[-0.01em] text-ink">
          Nog niets te tonen
        </p>
        <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
          Zodra je panden toevoegt, verschijnen ze hier. Nodig ondertussen je
          team of mede-eigenaar uit.
        </p>
      </div>
    </div>
  );
}
