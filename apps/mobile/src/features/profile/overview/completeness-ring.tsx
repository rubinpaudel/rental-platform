import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from 'heroui-native';

interface CompletenessRingProps {
  /** 0..100 from the server-computed weighted score. */
  pct: number;
  size?: number;
  stroke?: number;
}

/**
 * Low-fi circular progress meter. Renders a muted track + an accent
 * arc starting from 12 o'clock and sweeping clockwise to `pct`. Colours
 * are inlined hex equivalents of the global.css OKLCH tokens —
 * react-native-svg can't read CSS variables, and we want this to feel
 * unified with the rest of the screen.
 *
 * The numeric percentage rendered in the centre comes straight from
 * the server's completeness score; the client never recomputes it.
 */
export function CompletenessRing({
  pct,
  size = 132,
  stroke = 10,
}: CompletenessRingProps) {
  const safePct = Math.max(0, Math.min(100, pct));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - safePct / 100);

  // Hex mirrors of the relevant tokens — kept narrow on purpose so the
  // brand swap (post-MLP) only has to update one place.
  const TRACK = '#E8E8E8'; // ≈ oklch(0.922 0 0)
  const FILL = '#262626'; //  ≈ oklch(0.205 0 0)

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={TRACK}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={FILL}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute' }}>
        <Text type="h2" weight="bold">
          {Math.round(safePct)}%
        </Text>
      </View>
    </View>
  );
}
