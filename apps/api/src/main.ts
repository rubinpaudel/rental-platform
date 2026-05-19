import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';
import { toNodeHandler } from 'better-auth/node';
import type { AppConfig } from '@rental-platform/config';
import { AppModule } from './app.module';
import { auth } from './contexts/identity/infra/better-auth';

async function bootstrap(): Promise<void> {
  // Disable Nest's global body parser: Better Auth's handler must see the
  // raw request stream, so it is mounted BEFORE express.json().
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableShutdownHooks();

  // Canonical Better Auth + Nest/Express wiring: mount the handler first so
  // it owns /api/auth/* before any parser runs.
  app.use('/api/auth', toNodeHandler(auth));
  app.use(json());

  const config = app.get<ConfigService<AppConfig, true>>(ConfigService);
  const port = config.get('apiPort', { infer: true });

  await app.listen(port);
  console.info(`apps/api listening on :${port}`);
}

bootstrap().catch((err) => {
  console.error('apps/api failed to bootstrap', err);
  process.exit(1);
});
