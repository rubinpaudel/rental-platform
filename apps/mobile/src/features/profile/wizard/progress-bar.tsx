import { View } from 'react-native';

interface ProgressBarProps {
  /** 1-based index of the current step. */
  current: number;
  /** Total number of steps in the wizard. */
  total: number;
}

/**
 * Low-fidelity progress indicator for the wizard header. Renders a
 * full-width muted track with an accent-coloured fill — no labels, no
 * percentage, no animation. Polish lands when the brand handoff does.
 */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const pct = (safeCurrent / safeTotal) * 100;
  return (
    <View
      className="h-1 w-full overflow-hidden rounded-full bg-muted"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: safeTotal, now: safeCurrent }}
    >
      <View
        className="h-full rounded-full bg-accent"
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}
