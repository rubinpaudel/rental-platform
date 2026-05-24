import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    const message = result.error.issues
      .map((i) => {
        const path = i.path.length > 0 ? i.path.join('.') : '(body)';
        if (i.code === 'unrecognized_keys') {
          return `Unknown field: ${i.keys.join(', ')}`;
        }
        return `${path}: ${i.message}`;
      })
      .join('; ');

    throw new BadRequestException(message);
  }
}
