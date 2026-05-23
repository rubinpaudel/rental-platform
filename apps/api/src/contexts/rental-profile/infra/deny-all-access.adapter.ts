import { Injectable } from '@nestjs/common';
import type { RentalProfileAccessPort } from '../domain/rental-profile-access.port';

/**
 * v5 stub: until the Applications context (v9) lands, no landlord can read a
 * tenant's profile. v9 will replace this with an adapter that queries the
 * applications table for a row matching (tenant → listing in landlord's org).
 */
@Injectable()
export class DenyAllRentalProfileAccess implements RentalProfileAccessPort {
  async canMakelaarRead(): Promise<boolean> {
    return false;
  }
}
