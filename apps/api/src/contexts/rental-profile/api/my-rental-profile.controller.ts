import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Put,
} from '@nestjs/common';
import { RequireRole } from '../../identity/api/require-role.decorator';
import { CurrentUser, type SessionUser } from '../../identity/api/current-user.decorator';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { RentalProfileService } from '../app/rental-profile.service';
import { RENTAL_PROFILE_SERVICE } from '../tokens';
import { parseRentalProfileInput } from './rental-profile.input';
import { toRentalProfileDto } from './rental-profile.dto';

@Controller('me/rental-profile')
export class MyRentalProfileController {
  constructor(
    @Inject(RENTAL_PROFILE_SERVICE) private readonly service: RentalProfileService,
  ) {}

  @Get()
  @RequireRole('tenant')
  async get(@CurrentUser() user: SessionUser) {
    const profile = await this.service.getOwn({ userId: user.id as UserId });
    return toRentalProfileDto(profile);
  }

  @Put()
  @RequireRole('tenant')
  async put(@CurrentUser() user: SessionUser, @Body() body: unknown) {
    return this.upsert(user, body, 'replace');
  }

  @Patch()
  @RequireRole('tenant')
  async patch(@CurrentUser() user: SessionUser, @Body() body: unknown) {
    return this.upsert(user, body, 'patch');
  }

  private async upsert(user: SessionUser, body: unknown, mode: 'replace' | 'patch') {
    let patch;
    try {
      patch = parseRentalProfileInput(body);
    } catch (e) {
      throw new BadRequestException(e instanceof Error ? e.message : 'Invalid request body');
    }

    try {
      const profile = await this.service.upsertOwn({
        userId: user.id as UserId,
        patch,
        mode,
      });
      return toRentalProfileDto(profile);
    } catch (e) {
      if (e instanceof Error) throw new BadRequestException(e.message);
      throw e;
    }
  }
}
