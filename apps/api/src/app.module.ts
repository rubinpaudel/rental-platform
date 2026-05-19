import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './contexts/identity/identity.module';

@Module({
  imports: [ConfigModule, DbModule, StorageModule, HealthModule, IdentityModule],
})
export class AppModule {}
