import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3StorageAdapter, type StoragePort } from '@rental-platform/storage';
import type { AppConfig } from '@rental-platform/config';

export const STORAGE = Symbol('STORAGE');

@Global()
@Module({
  providers: [
    {
      provide: STORAGE,
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>): StoragePort =>
        new S3StorageAdapter(config.get('storage', { infer: true })),
    },
  ],
  exports: [STORAGE],
})
export class StorageModule {}
