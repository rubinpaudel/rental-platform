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
import type { ProfileService } from '../app/profile.service';
import { PROFILE_SERVICE } from '../tokens';
import { parseProfileInput } from './profile.input';
import { toProfileDto } from './profile.dto';

@Controller('me/profile')
export class MyProfileController {
  constructor(
    @Inject(PROFILE_SERVICE) private readonly service: ProfileService,
  ) {}

  @Get()
  @RequireRole('tenant')
  async get(@CurrentUser() user: SessionUser) {
    const profile = await this.service.getOwn({ userId: user.id as UserId });
    return toProfileDto(profile);
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
      patch = parseProfileInput(body);
    } catch (e) {
      throw new BadRequestException(e instanceof Error ? e.message : 'Invalid request body');
    }

    try {
      const profile = await this.service.upsertOwn({
        userId: user.id as UserId,
        patch,
        mode,
      });
      return toProfileDto(profile);
    } catch (e) {
      if (e instanceof Error) throw new BadRequestException(e.message);
      throw e;
    }
  }
}
