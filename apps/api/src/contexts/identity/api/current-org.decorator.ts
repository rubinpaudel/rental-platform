import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * Injects the active organization id from the session. Use behind
 * BetterAuthGuard. Null only if the auto-create-org hook hasn't run (should
 * never happen for a real signup).
 */
export const CurrentOrg = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const req = ctx
      .switchToHttp()
      .getRequest<{ session?: { activeOrganizationId?: string | null } }>();
    return req.session?.activeOrganizationId ?? null;
  },
);
