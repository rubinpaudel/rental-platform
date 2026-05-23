import { Controller, Get, Param, Query, Inject, NotFoundException } from '@nestjs/common';
import { ListingService, ListingNotFoundError } from '../app/listing.service';
import { listingId } from '../domain/listing-id.vo';
import { toPublicListingDto, toPaginatedDto } from './listing.dto';
import { LISTING_SERVICE } from './listing.controller';

@Controller('public/listings')
export class PublicListingController {
  constructor(
    @Inject(LISTING_SERVICE) private readonly service: ListingService,
  ) {}

  @Get()
  async feed(@Query('cursor') cursor?: string, @Query('limit') limitStr?: string) {
    const limit = clampLimit(limitStr);
    const result = await this.service.listPublicFeed({ cursor, limit });
    return toPaginatedDto(result, toPublicListingDto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const listing = await this.service.getPublicListing({ id: listingId(id) });
      return toPublicListingDto(listing);
    } catch (e) {
      if (e instanceof ListingNotFoundError) throw new NotFoundException();
      throw e;
    }
  }
}

function clampLimit(val?: string): number {
  const n = val ? parseInt(val, 10) : 20;
  if (isNaN(n) || n < 1) return 20;
  return Math.min(n, 50);
}
