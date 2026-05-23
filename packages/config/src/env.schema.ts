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

  // ── Identity / Better Auth ──────────────────────────────────
  // Better Auth signing secret. Generate with: openssl rand -base64 32
  BETTER_AUTH_SECRET: z.string().min(32),
  // Public base URL of the API (where /api/auth/* is served).
  BETTER_AUTH_URL: z.string().url().default('http://localhost:4000'),
  // Comma-separated origins allowed to call auth (frontends land in v2a/v2b).
  AUTH_TRUSTED_ORIGINS: z.string().default('http://localhost:3000'),
  // Public base URL of the landlord web app (v2a). Used to build the links
  // emailed for verification, password reset, and org invitations so they
  // land in the frontend, not on the API.
  WEB_APP_URL: z.string().url().default('http://localhost:3000'),
  // Email verification is mandatory in prod. Local/test stacks set this false
  // so automated flows (Bruno) can sign in without an out-of-band click.
  AUTH_REQUIRE_EMAIL_VERIFICATION: z
    .union([z.string(), z.boolean()])
    .transform((v) => (typeof v === 'boolean' ? v : v === 'true' || v === '1'))
    .default(true),
  // Transactional email — generic SMTP. Local/dev → Mailpit (see
  // infra/docker-compose.yml). Prod → the deployment's SMTP provider.
  // Provider choice is pure config, never a code change.
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('rental-platform@localhost'),
});

export type Env = z.infer<typeof envSchema>;
