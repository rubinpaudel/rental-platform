import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserRole } from '../domain/user-role.vo';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  role: UserRole;
}

/** Injects the authenticated user. Use behind BetterAuthGuard. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUser | undefined => {
    return ctx.switchToHttp().getRequest<{ user?: SessionUser }>().user;
  },
);
