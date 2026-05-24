import { Controller, Get, Query, Header } from '@nestjs/common';
import { PostalService, clampSearchLimit } from '../app/postal.service';
import { DEFAULT_COUNTRY, isSupportedCountry, type Country } from '../domain/country';
import type { PostalCityDto } from './postal.dto';

@Controller('postal')
export class PostalController {
  constructor(private readonly service: PostalService) {}

  @Get('lookup')
  @Header('Cache-Control', 'public, max-age=86400, immutable')
  async lookup(
    @Query('postalCode') postalCode?: string,
    @Query('country') country?: string,
  ): Promise<PostalCityDto[]> {
    if (!postalCode) return [];
    return this.service.lookup(resolveCountry(country), postalCode);
  }

  @Get('search')
  @Header('Cache-Control', 'public, max-age=300')
  async search(
    @Query('q') q?: string,
    @Query('country') country?: string,
    @Query('limit') limit?: string,
  ): Promise<PostalCityDto[]> {
    if (!q) return [];
    return this.service.search(resolveCountry(country), q, clampSearchLimit(limit));
  }
}

function resolveCountry(raw?: string): Country {
  if (!raw) return DEFAULT_COUNTRY;
  const upper = raw.toUpperCase();
  return isSupportedCountry(upper) ? upper : DEFAULT_COUNTRY;
}
