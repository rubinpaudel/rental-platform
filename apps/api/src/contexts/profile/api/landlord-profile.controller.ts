import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { RequireRole } from '../../identity/api/require-role.decorator';
import { CurrentOrg } from '../../identity/api/current-org.decorator';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import { userId } from '../../identity/domain/user-id.vo';
import {
  ProfileAccessDeniedError,
  ProfileNotFoundError,
} from '../app/profile.service';
import type { ProfileService } from '../app/profile.service';
import { PROFILE_SERVICE } from '../tokens';
import { toProfileDto } from './profile.dto';

@Controller('profiles')
export class LandlordProfileController {
  constructor(
    @Inject(PROFILE_SERVICE) private readonly service: ProfileService,
  ) {}

  @Get(':userId')
  @RequireRole('landlord')
  async getOne(@CurrentOrg() orgId: string | null, @Param('userId') tenantId: string) {
    if (!orgId) throw new ForbiddenException('No active organization');

    try {
      const profile = await this.service.readForLandlord({
        tenantUserId: userId(tenantId),
        landlordOrgId: orgId as OrganizationId,
      });
      return toProfileDto(profile);
    } catch (e) {
      if (e instanceof ProfileAccessDeniedError) {
        throw new ForbiddenException(e.message);
      }
      if (e instanceof ProfileNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }
}
