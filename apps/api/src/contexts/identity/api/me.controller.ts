import { Controller, Get, UseGuards } from '@nestjs/common';
import { BetterAuthGuard } from './better-auth.guard';
import { CurrentUser, type SessionUser } from './current-user.decorator';
import { CurrentOrg } from './current-org.decorator';
import { RequireRole } from './require-role.decorator';

@Controller()
export class MeController {
  /** Session hydration for frontends. */
  @Get('me')
  @UseGuards(BetterAuthGuard)
  me(@CurrentUser() user: SessionUser, @CurrentOrg() activeOrganization: string | null) {
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      activeOrganization,
      role: user.role,
    };
  }

  /**
   * Role-gated example: landlord-only. 401 if unauthenticated, 403 for a
   * tenant session. Proves the @RequireRole guard wiring.
   */
  @Get('me/landlord')
  @RequireRole('landlord')
  landlordOnly(@CurrentOrg() activeOrganization: string | null) {
    return { landlordOrganization: activeOrganization };
  }
}
