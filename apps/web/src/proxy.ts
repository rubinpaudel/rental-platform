import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const AUTH_ENTRY_ROUTES = new Set(['/auth/sign-in', '/auth/sign-up']);

/**
 * Broad "is signed in at all" gate, server-side, before the page renders —
 * so protected routes never flash a logged-out state, and the sign-in /
 * sign-up screens never show to an already-authenticated user. This is a
 * fast cookie presence check only; authoritative session resolution still
 * happens in the dashboard layout (see lib/server-session.ts).
 *
 * Next 16 renamed the "middleware" convention to "proxy" — same runtime
 * model, new file name + exported function name.
 */
export function proxy(request: NextRequest) {
  const hasSession = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (AUTH_ENTRY_ROUTES.has(pathname)) {
    if (hasSession) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next();
  }

  if (!hasSession) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/sign-in', '/auth/sign-up'],
};
