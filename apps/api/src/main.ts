import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@rental-platform/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const config = app.get<ConfigService<AppConfig, true>>(ConfigService);
  const port = config.get('apiPort', { infer: true });

  await app.listen(port);
  console.info(`apps/api listening on :${port}`);
}

bootstrap().catch((err) => {
  console.error('apps/api failed to bootstrap', err);
  process.exit(1);
});
