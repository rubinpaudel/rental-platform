import { Module } from '@nestjs/common';
import type { Database } from '@rental-platform/db';
import type { StoragePort } from '@rental-platform/storage';
import { DATABASE } from '../../db/db.module';
import { STORAGE } from '../../storage/storage.module';
import { LISTING_REPO } from './domain/listing.repo';
import type { ListingRepo } from './domain/listing.repo';
import { ListingDrizzleRepo } from './infra/listing.drizzle-repo';
import { ListingService } from './app/listing.service';
import { ListingController, LISTING_SERVICE } from './api/listing.controller';
import { PublicListingController } from './api/public-listing.controller';

@Module({
  controllers: [ListingController, PublicListingController],
  providers: [
    {
      provide: LISTING_REPO,
      inject: [DATABASE],
      useFactory: (db: Database) => new ListingDrizzleRepo(db),
    },
    {
      provide: LISTING_SERVICE,
      inject: [LISTING_REPO, STORAGE],
      useFactory: (repo: ListingRepo, storage: StoragePort) =>
        new ListingService(repo, storage),
    },
  ],
  exports: [LISTING_SERVICE],
})
export class ListingModule {}
