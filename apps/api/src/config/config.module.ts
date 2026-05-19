import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { loadConfig } from '@rental-platform/config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      // Single source of truth: the Zod-validated structured config. Throws
      // at boot if any required env var is missing or malformed.
      load: [() => loadConfig()],
    }),
  ],
})
export class ConfigModule {}
