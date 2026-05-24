import { Module } from '@nestjs/common';
import type { Database } from '@rental-platform/db';
import { DATABASE } from '../../db/db.module';
import { PROFILE_REPO } from './domain/profile.repo';
import type { ProfileRepo } from './domain/profile.repo';
import { PROFILE_ACCESS_PORT } from './domain/profile-access.port';
import type { ProfileAccessPort } from './domain/profile-access.port';
import { ProfileDrizzleRepo } from './infra/profile.drizzle-repo';
import { DenyAllProfileAccess } from './infra/deny-all-access.adapter';
import { ProfileService } from './app/profile.service';
import { PROFILE_SERVICE } from './tokens';
import { MyProfileController } from './api/my-profile.controller';
import { LandlordProfileController } from './api/landlord-profile.controller';

@Module({
  controllers: [MyProfileController, LandlordProfileController],
  providers: [
    {
      provide: PROFILE_REPO,
      inject: [DATABASE],
      useFactory: (db: Database) => new ProfileDrizzleRepo(db),
    },
    {
      provide: PROFILE_ACCESS_PORT,
      useClass: DenyAllProfileAccess,
    },
    {
      provide: PROFILE_SERVICE,
      inject: [PROFILE_REPO, PROFILE_ACCESS_PORT],
      useFactory: (repo: ProfileRepo, access: ProfileAccessPort) =>
        new ProfileService(repo, access),
    },
  ],
  exports: [PROFILE_SERVICE, PROFILE_ACCESS_PORT],
})
export class ProfileModule {}
