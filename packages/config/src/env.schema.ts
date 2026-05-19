import { z } from 'zod';

/**
 * The full env contract for the platform. Every variable the platform will
 * ever need is enumerated here; later milestones extend this schema. Boot
 * fails fast (ZodError) if anything required is missing or malformed.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().url(),

  // S3_ENDPOINT is optional: empty/unset means real AWS S3 (SDK default
  // endpoint). Set it for MinIO/LocalStack or any S3-compatible provider.
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
