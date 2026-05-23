import { Module } from '@nestjs/common';
import type { Database } from '@rental-platform/db';
import { DATABASE } from '../../db/db.module';
import { RENTAL_PROFILE_REPO } from './domain/rental-profile.repo';
import type { RentalProfileRepo } from './domain/rental-profile.repo';
import { RENTAL_PROFILE_ACCESS_PORT } from './domain/rental-profile-access.port';
import type { RentalProfileAccessPort } from './domain/rental-profile-access.port';
import { RentalProfileDrizzleRepo } from './infra/rental-profile.drizzle-repo';
import { DenyAllRentalProfileAccess } from './infra/deny-all-access.adapter';
import { RentalProfileService } from './app/rental-profile.service';
import { RENTAL_PROFILE_SERVICE } from './tokens';
import { MyRentalProfileController } from './api/my-rental-profile.controller';
import { LandlordRentalProfileController } from './api/landlord-rental-profile.controller';

@Module({
  controllers: [MyRentalProfileController, LandlordRentalProfileController],
  providers: [
    {
      provide: RENTAL_PROFILE_REPO,
      inject: [DATABASE],
      useFactory: (db: Database) => new RentalProfileDrizzleRepo(db),
    },
    {
      provide: RENTAL_PROFILE_ACCESS_PORT,
      useClass: DenyAllRentalProfileAccess,
    },
    {
      provide: RENTAL_PROFILE_SERVICE,
      inject: [RENTAL_PROFILE_REPO, RENTAL_PROFILE_ACCESS_PORT],
      useFactory: (repo: RentalProfileRepo, access: RentalProfileAccessPort) =>
        new RentalProfileService(repo, access),
    },
  ],
  exports: [RENTAL_PROFILE_SERVICE, RENTAL_PROFILE_ACCESS_PORT],
})
export class RentalProfileModule {}
