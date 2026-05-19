import { Global, Module, type OnApplicationShutdown, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDb, type Database, type DbHandle } from '@rental-platform/db';
import type { AppConfig } from '@rental-platform/config';

export const DATABASE = Symbol('DATABASE');
const DB_HANDLE = Symbol('DB_HANDLE');

@Global()
@Module({
  providers: [
    {
      provide: DB_HANDLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>): DbHandle =>
        createDb(config.get('database', { infer: true }).url),
    },
    {
      provide: DATABASE,
      inject: [DB_HANDLE],
      useFactory: (handle: DbHandle): Database => handle.db,
    },
  ],
  exports: [DATABASE],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(DB_HANDLE) private readonly handle: DbHandle) {}

  async onApplicationShutdown(): Promise<void> {
    await this.handle.close();
  }
}
