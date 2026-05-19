import { Module, type OnApplicationShutdown } from '@nestjs/common';
import { IDENTITY_PORT } from './domain/identity.port';
import { IdentityAdapter } from './infra/identity.adapter';
import { IdentityService } from './app/identity.service';
import { BetterAuthGuard } from './api/better-auth.guard';
import { RoleGuard } from './api/require-role.decorator';
import { MeController } from './api/me.controller';
import { closeAuthDb } from './infra/better-auth';

/**
 * Thin Identity wiring. Better Auth's HTTP handler is mounted on Express in
 * main.ts (canonical Better Auth + Nest pattern); this module only exposes
 * the guard and the IdentityPort other contexts depend on.
 */
@Module({
  controllers: [MeController],
  providers: [
    { provide: IDENTITY_PORT, useClass: IdentityAdapter },
    IdentityService,
    BetterAuthGuard,
    RoleGuard,
  ],
  exports: [IDENTITY_PORT, IdentityService, BetterAuthGuard],
})
export class IdentityModule implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await closeAuthDb();
  }
}
