import {
  ForbiddenException,
  Inject,
  Injectable,
  SetMetadata,
  UseGuards,
  applyDecorators,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../domain/user-role.vo';
import { BetterAuthGuard } from './better-auth.guard';
import type { SessionUser } from './current-user.decorator';

const ROLE_KEY = 'required_role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole | undefined>(ROLE_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true;

    const user = ctx.switchToHttp().getRequest<{ user?: SessionUser }>().user;
    if (user?.role !== required) {
      throw new ForbiddenException(`requires role: ${required}`);
    }
    return true;
  }
}

/**
 * Gate a route to a single role. Implies authentication: applies
 * BetterAuthGuard (401 if unauthenticated) then RoleGuard (403 if wrong role).
 */
export function RequireRole(role: UserRole): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(ROLE_KEY, role),
    UseGuards(BetterAuthGuard, RoleGuard),
  );
}
