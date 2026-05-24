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
import { profileInputSchema, type ProfileInput } from './profile.input.schema';
import { toProfileDto } from './profile.dto';
import { ZodValidationPipe } from './zod-validation.pipe';

const profileInputPipe = new ZodValidationPipe(profileInputSchema);

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
  async put(
    @CurrentUser() user: SessionUser,
    @Body(profileInputPipe) input: ProfileInput,
  ) {
    return this.upsert(user, input, 'replace');
  }

  @Patch()
  @RequireRole('tenant')
  async patch(
    @CurrentUser() user: SessionUser,
    @Body(profileInputPipe) input: ProfileInput,
  ) {
    return this.upsert(user, input, 'patch');
  }

  private async upsert(user: SessionUser, input: ProfileInput, mode: 'replace' | 'patch') {
    try {
      const profile = await this.service.upsertOwn({
        userId: user.id as UserId,
        // ProfileInput is structurally a ProfilePatch; the small mismatch is
        // Zod's `.optional()` emitting `T | undefined` for fields the domain
        // declares as bare `?` (exactOptionalPropertyTypes is on). Runtime is
        // identical — an explicit undefined and an omitted key both no-op.
        patch: input as Parameters<typeof this.service.upsertOwn>[0]['patch'],
        mode,
      });
      return toProfileDto(profile);
    } catch (e) {
      if (e instanceof Error) throw new BadRequestException(e.message);
      throw e;
    }
  }
}
