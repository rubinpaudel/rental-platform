import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../infra/better-auth';

/**
 * Rejects unauthenticated requests (401). On success, attaches the Better
 * Auth session + user to the request for the param decorators to read.
 */
@Injectable()
export class BetterAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const result = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!result) throw new UnauthorizedException('not signed in');

    req.user = result.user;
    req.session = result.session;
    return true;
  }
}
