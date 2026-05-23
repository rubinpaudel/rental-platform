import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

/** Editorial wordmark — serif name with an accent terminal dot. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Text className={cn('text-2xl font-medium tracking-tight text-ink', className)}>
      Huurplatform<Text className="text-accent">.</Text>
    </Text>
  );
}
