import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './contexts/identity/identity.module';
import { ListingModule } from './contexts/listing/listing.module';

@Module({
  imports: [ConfigModule, DbModule, StorageModule, HealthModule, IdentityModule, ListingModule],
})
export class AppModule {}
