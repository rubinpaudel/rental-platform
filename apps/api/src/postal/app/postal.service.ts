import { Inject, Injectable } from '@nestjs/common';
import type { Country } from '../domain/country';
import type { PostalCityDto } from '../api/postal.dto';
import { POSTAL_REPO, type PostalRepo } from '../domain/postal.repo';

/**
 * Thin pass-through to the repo. Lives between the controller and the
 * adapter so we can layer in caching, country-specific transforms, or rate
 * limiting later without touching the HTTP layer.
 */
@Injectable()
export class PostalService {
  constructor(@Inject(POSTAL_REPO) private readonly repo: PostalRepo) {}

  lookup(country: Country, postalCode: string): Promise<PostalCityDto[]> {
    return this.repo.findByPostalCode(country, postalCode);
  }

  search(country: Country, query: string, limit: number): Promise<PostalCityDto[]> {
    return this.repo.search(country, query, limit);
  }
}

export function clampSearchLimit(raw: unknown): number {
  const n = typeof raw === 'string' ? parseInt(raw, 10) : 20;
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(n, 50);
}
