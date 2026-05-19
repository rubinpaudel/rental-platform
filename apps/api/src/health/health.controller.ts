import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { Database } from '@rental-platform/db';
import type { StoragePort } from '@rental-platform/storage';
import { DATABASE } from '../db/db.module';
import { STORAGE } from '../storage/storage.module';

type CheckStatus = 'ok' | 'error';

interface HealthResponse {
  status: 'ok';
  db: CheckStatus;
  storage: CheckStatus;
}

@Controller('health')
export class HealthController {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(STORAGE) private readonly storage: StoragePort,
  ) {}

  @Get()
  async check(): Promise<HealthResponse> {
    const [db, storage] = await Promise.all([this.checkDb(), this.checkStorage()]);

    if (db !== 'ok' || storage !== 'ok') {
      throw new ServiceUnavailableException({ status: 'error', db, storage });
    }

    return { status: 'ok', db, storage };
  }

  private async checkDb(): Promise<CheckStatus> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return 'ok';
    } catch {
      return 'error';
    }
  }

  private async checkStorage(): Promise<CheckStatus> {
    try {
      await this.storage.headBucket();
      return 'ok';
    } catch {
      return 'error';
    }
  }
}
