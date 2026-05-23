import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Broad "is signed in at all" gate, server-side, before the page renders —
 * so protected routes never flash a logged-out state. This is a fast cookie
 * presence check only; authoritative session resolution happens in the
 * dashboard layout (see lib/server-session.ts).
 *
 * Next 16 renamed the "middleware" convention to "proxy" — same runtime
 * model, new file name + exported function name.
 */
export function proxy(request: NextRequest) {
  const hasSession = getSessionCookie(request);
  if (!hasSession) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
