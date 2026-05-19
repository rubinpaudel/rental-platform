import { envSchema, type Env } from './env.schema';

export interface AppConfig {
  nodeEnv: Env['NODE_ENV'];
  apiPort: number;
  database: {
    url: string;
  };
  storage: {
    endpoint: string | undefined;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  auth: {
    secret: string;
    baseUrl: string;
    trustedOrigins: string[];
    requireEmailVerification: boolean;
  };
  smtp: {
    host: string;
    port: number;
    user: string | undefined;
    pass: string | undefined;
    from: string;
  };
}

/**
 * Validate `source` (defaults to process.env) against the env schema and
 * produce a typed, structured config object. Throws ZodError on the first
 * invalid/missing variable so misconfiguration is caught at boot.
 */
export function loadConfig(source: Record<string, unknown> = process.env): AppConfig {
  const env = envSchema.parse(source);

  return {
    nodeEnv: env.NODE_ENV,
    apiPort: env.API_PORT,
    database: {
      url: env.DATABASE_URL,
    },
    storage: {
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    auth: {
      secret: env.BETTER_AUTH_SECRET,
      baseUrl: env.BETTER_AUTH_URL,
      trustedOrigins: env.AUTH_TRUSTED_ORIGINS.split(',')
        .map((o) => o.trim())
        .filter(Boolean),
      requireEmailVerification: env.AUTH_REQUIRE_EMAIL_VERIFICATION,
    },
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      from: env.EMAIL_FROM,
    },
  };
}
