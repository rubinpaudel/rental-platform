import { ActivityIndicator } from 'react-native';

interface SpinnerProps {
  tone?: 'ink' | 'paper';
  size?: 'small' | 'large';
}

const COLORS: Record<NonNullable<SpinnerProps['tone']>, string> = {
  ink: '#0a0a0a',
  paper: '#ffffff',
};

export function Spinner({ tone = 'ink', size = 'small' }: SpinnerProps) {
  return <ActivityIndicator color={COLORS[tone]} size={size} />;
}
