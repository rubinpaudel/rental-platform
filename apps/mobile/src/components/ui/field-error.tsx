import { Text } from './text';

export function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <Text className="text-sm text-danger">{message}</Text>;
}
