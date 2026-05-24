import { Module } from '@nestjs/common';
import type { Database } from '@rental-platform/db';
import { DATABASE } from '../db/db.module';
import { PostalController } from './api/postal.controller';
import { PostalService } from './app/postal.service';
import { POSTAL_REPO } from './domain/postal.repo';
import { PostalDrizzleRepo } from './infra/postal.drizzle-repo';

@Module({
  controllers: [PostalController],
  providers: [
    {
      provide: POSTAL_REPO,
      inject: [DATABASE],
      useFactory: (db: Database) => new PostalDrizzleRepo(db),
    },
    PostalService,
  ],
  exports: [PostalService],
})
export class PostalModule {}
