import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Put,
  Param,
  Body,
  Query,
  Inject,
  NotFoundException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { RequireRole } from '../../identity/api/require-role.decorator';
import { CurrentUser, type SessionUser } from '../../identity/api/current-user.decorator';
import { CurrentOrg } from '../../identity/api/current-org.decorator';
import type { ListingService } from '../app/listing.service';
import { ListingNotFoundError, ListingClosedError } from '../app/listing.service';
import { listingId } from '../domain/listing-id.vo';
import { listingStatus } from '../domain/listing-status.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type {
  CreateListingBody,
  UpdateListingBody,
  PresignPhotoBody,
  AddPhotoBody,
  ReorderPhotosBody,
  AddRoomBody,
  UpdateRoomBody,
  ReorderRoomsBody,
} from './listing.requests';
import { toListingDetailDto, toListingSummaryDto, toPaginatedDto } from './listing.dto';

const LISTING_SERVICE = Symbol('ListingService');

@Controller('listings')
export class ListingController {
  constructor(@Inject(LISTING_SERVICE) private readonly service: ListingService) {}

  @Post()
  @RequireRole('landlord')
  async create(
    @CurrentUser() user: SessionUser,
    @CurrentOrg() orgId: string,
    @Body() body: CreateListingBody,
  ) {
    const listing = await this.service.create({
      orgId: orgId as OrganizationId,
      createdBy: user.id as UserId,
      description: body.description,
      address: body.address,
      classification: body.classification,
      availability: body.availability,
      pricing: body.pricing,
      surface: body.surface,
      roomCounts: body.roomCounts,
      building: body.building,
      exterior: body.exterior,
      energy: body.energy,
      interior: body.interior,
      petPolicy: body.petPolicy,
      regulatory: body.regulatory,
      compliance: body.compliance,
    });
    return toListingDetailDto(listing);
  }

  @Get()
  @RequireRole('landlord')
  async list(
    @CurrentOrg() orgId: string,
    @Query('status') status?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limitStr?: string,
  ) {
    const limit = clampLimit(limitStr);
    const result = await this.service.listMyOrgListings({
      orgId: orgId as OrganizationId,
      status: status ? listingStatus(status) : undefined,
      cursor,
      limit,
    });
    return toPaginatedDto(result, toListingSummaryDto);
  }

  @Get(':id')
  @RequireRole('landlord')
  async getOne(@CurrentOrg() orgId: string, @Param('id') id: string) {
    try {
      const listing = await this.service.getListing({
        id: listingId(id),
        orgId: orgId as OrganizationId,
      });
      return toListingDetailDto(listing);
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      throw e;
    }
  }

  @Patch(':id')
  @RequireRole('landlord')
  async update(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: UpdateListingBody,
  ) {
    try {
      const listing = await this.service.update({
        id: listingId(id),
        orgId: orgId as OrganizationId,
        ...body,
      });
      return toListingDetailDto(listing);
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof ListingClosedError) throw new BadRequestException(e.message);
      throw e;
    }
  }

  @Delete(':id')
  @RequireRole('landlord')
  @HttpCode(204)
  async delete(@CurrentOrg() orgId: string, @Param('id') id: string) {
    try {
      await this.service.delete({ id: listingId(id), orgId: orgId as OrganizationId });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      throw e;
    }
  }

  @Post(':id/activate')
  @RequireRole('landlord')
  @HttpCode(204)
  async activate(@CurrentOrg() orgId: string, @Param('id') id: string) {
    try {
      await this.service.activate({ id: listingId(id), orgId: orgId as OrganizationId });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof Error && e.message.includes('closed'))
        throw new BadRequestException(e.message);
      throw e;
    }
  }

  @Post(':id/deactivate')
  @RequireRole('landlord')
  @HttpCode(204)
  async deactivate(@CurrentOrg() orgId: string, @Param('id') id: string) {
    try {
      await this.service.deactivate({ id: listingId(id), orgId: orgId as OrganizationId });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof Error && e.message.includes('closed'))
        throw new BadRequestException(e.message);
      throw e;
    }
  }

  @Post(':id/photos/presign')
  @RequireRole('landlord')
  async presignPhoto(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: PresignPhotoBody,
  ) {
    try {
      return await this.service.presignPhotoUpload({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        filename: body.filename,
        contentType: body.contentType,
      });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      throw e;
    }
  }

  @Post(':id/photos')
  @RequireRole('landlord')
  @HttpCode(201)
  async addPhoto(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: AddPhotoBody,
  ) {
    try {
      await this.service.addPhoto({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        storageKey: body.storageKey,
        alt: body.alt ?? null,
      });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof Error && (e.message.includes('Maximum') || e.message.includes('already')))
        throw new BadRequestException(e.message);
      throw e;
    }
  }

  @Delete(':id/photos/:storageKey')
  @RequireRole('landlord')
  @HttpCode(204)
  async removePhoto(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Param('storageKey') storageKey: string,
  ) {
    try {
      await this.service.removePhoto({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        storageKey,
      });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof Error && e.message.includes('not found'))
        throw new BadRequestException(e.message);
      throw e;
    }
  }

  @Put(':id/photos/order')
  @RequireRole('landlord')
  @HttpCode(204)
  async reorderPhotos(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: ReorderPhotosBody,
  ) {
    try {
      await this.service.reorderPhotos({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        storageKeys: body.storageKeys,
      });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (
        e instanceof Error &&
        (e.message.includes('Must provide') || e.message.includes('Unknown'))
      )
        throw new BadRequestException(e.message);
      throw e;
    }
  }

  @Post(':id/rooms')
  @RequireRole('landlord')
  @HttpCode(201)
  async addRoom(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: AddRoomBody,
  ) {
    try {
      const listing = await this.service.addRoom({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        roomType: body.roomType,
        label: body.label ?? null,
        surfaceM2: body.surfaceM2 ?? null,
      });
      return toListingDetailDto(listing);
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (
        e instanceof Error &&
        (e.message.includes('Invalid roomType') ||
          e.message.includes('Maximum') ||
          e.message.includes('non-negative'))
      ) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Patch(':id/rooms/:roomId')
  @RequireRole('landlord')
  async updateRoom(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Param('roomId') roomId: string,
    @Body() body: UpdateRoomBody,
  ) {
    try {
      const listing = await this.service.updateRoom({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        roomId,
        label: body.label,
        surfaceM2: body.surfaceM2,
      });
      return toListingDetailDto(listing);
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof Error && e.message === 'Room not found') throw new NotFoundException();
      if (e instanceof Error && e.message.includes('non-negative')) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Delete(':id/rooms/:roomId')
  @RequireRole('landlord')
  @HttpCode(204)
  async removeRoom(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Param('roomId') roomId: string,
  ) {
    try {
      await this.service.removeRoom({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        roomId,
      });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (e instanceof Error && e.message === 'Room not found') throw new NotFoundException();
      throw e;
    }
  }

  @Put(':id/rooms/order')
  @RequireRole('landlord')
  @HttpCode(204)
  async reorderRooms(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: ReorderRoomsBody,
  ) {
    try {
      await this.service.reorderRooms({
        listingId: listingId(id),
        orgId: orgId as OrganizationId,
        roomType: body.roomType,
        roomIds: body.roomIds,
      });
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      if (
        e instanceof Error &&
        (e.message.includes('Must provide') || e.message.includes('Unknown'))
      )
        throw new BadRequestException(e.message);
      throw e;
    }
  }
}

export { LISTING_SERVICE };

function clampLimit(val?: string): number {
  const n = val ? parseInt(val, 10) : 20;
  if (isNaN(n) || n < 1) return 20;
  return Math.min(n, 50);
}
