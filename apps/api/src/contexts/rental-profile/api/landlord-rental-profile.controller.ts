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
  RentalProfileAccessDeniedError,
  RentalProfileNotFoundError,
} from '../app/rental-profile.service';
import type { RentalProfileService } from '../app/rental-profile.service';
import { RENTAL_PROFILE_SERVICE } from '../tokens';
import { toRentalProfileDto } from './rental-profile.dto';

@Controller('rental-profiles')
export class LandlordRentalProfileController {
  constructor(
    @Inject(RENTAL_PROFILE_SERVICE) private readonly service: RentalProfileService,
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
      return toRentalProfileDto(profile);
    } catch (e) {
      if (e instanceof RentalProfileAccessDeniedError) {
        throw new ForbiddenException(e.message);
      }
      if (e instanceof RentalProfileNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }
}
