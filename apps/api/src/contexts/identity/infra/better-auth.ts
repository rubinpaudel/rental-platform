import { betterAuth, type Auth as BetterAuthInstance } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { createDb } from '@rental-platform/db';
import { loadConfig } from '@rental-platform/config';
import { sendEmail } from './mail';
import { isOrganizationKind, type OrganizationKind } from '../domain/organization-kind.vo';
import * as schema from './schema';

const {
  database,
  auth: { secret, baseUrl: baseURL, trustedOrigins, requireEmailVerification, webAppUrl },
} = loadConfig();

// Better Auth needs its drizzle client at module-eval (before Nest DI exists),
// so it owns a small dedicated pool. `closeAuthDb` is wired to Nest shutdown
// by IdentityModule so this pool doesn't leak.
const { db, close: closeAuthDb } = createDb(database.url);
export { closeAuthDb };

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) +
    '-' +
    Math.random().toString(36).slice(2, 8)
  );
}

function orgNameFor(name: string, role: string | undefined, kind: OrganizationKind): string {
  if (kind === 'agency') return `${name} Agency`;
  if (role === 'landlord') return `${name} Lettings`;
  return `${name} (personal)`;
}

interface CreatedUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

// Better Auth passes the endpoint context as the 2nd hook arg; we only read
// the sign-up body off it.
interface HookContext {
  body?: Record<string, unknown>;
}

// The organization plugin augments `auth.api` at runtime, but the cast base
// `Auth` type doesn't carry plugin endpoints. Type only the slice we call.
interface OrgApi {
  createOrganization(args: {
    body: {
      name: string;
      slug: string;
      userId: string;
      keepCurrentActiveOrganization?: boolean;
    };
  }): Promise<{ id: string } | null>;
}

// Cast through `unknown` is the standard escape hatch for Better Auth's
// generic-heavy return type (it otherwise leaks zod internals through the
// d.ts emit, TS2742). Runtime behavior is identical to the inferred type.
const _auth = betterAuth({
  appName: 'rental-platform',
  baseURL,
  secret,
  trustedOrigins,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification,
    sendResetPassword: async ({ user, token }) => {
      const url = `${webAppUrl}/reset-password?token=${encodeURIComponent(token)}`;
      await sendEmail({
        to: user.email,
        subject: 'Reset your password — rental-platform',
        text: `We received a request to reset your password. Use the link below:\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email — rental-platform',
        text: `Welcome. Confirm your email to activate your account:\n\n${url}`,
      });
    },
  },

  user: {
    additionalFields: {
      // 'tenant' | 'landlord'. Required at signup. Not re-exposed on any
      // update path, so it is effectively immutable post-creation.
      // This is the ONLY user additionalField — keeping it minimal means the
      // Better Auth schema stays exactly what the CLI generates (zero-diff).
      role: { type: 'string', required: true, input: true },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  // Better Auth 1.6's organization plugin has no `organizationCreation`
  // option (the spec snippet predates the current API). The org is created
  // in the user-create hook below, where we also set its display name.
  plugins: [
    organization({
      // `kind` is our own column (set by the user-create hook below), not a
      // Better-Auth-managed field. Declaring it here — server-set, optional,
      // never client-input — makes Better Auth SELECT and return it on
      // organization payloads (active org, full org, list) so the web app
      // can branch copy on `activeOrganization.kind`.
      schema: {
        organization: {
          additionalFields: {
            kind: { type: 'string', required: false, input: false },
          },
        },
      },
      sendInvitationEmail: async (data) => {
        const url = `${webAppUrl}/accept-invitation/${data.id}`;
        await sendEmail({
          to: data.email,
          subject: `You're invited to join ${data.organization.name} — rental-platform`,
          text: `${data.inviter.user.name} invited you to join ${data.organization.name}.\n\nAccept the invitation:\n\n${url}`,
        });
      },
    }),
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user: CreatedUser, ctx: HookContext | null) => {
          // Better Auth forwards the full sign-up body on the hook context,
          // so org kind rides the request without a user-table column.
          const rawOrgKind = ctx?.body?.orgKind;
          const requested: OrganizationKind = isOrganizationKind(rawOrgKind)
            ? rawOrgKind
            : 'private';
          const kind: OrganizationKind =
            user.role === 'landlord' && requested === 'agency' ? 'agency' : 'private';
          const orgName = orgNameFor(user.name, user.role, kind);
          // issue #6791: createOrganization is rejected inside this hook when
          // `allowUserToCreateOrganization` is false, so it's left default.
          const org = await orgApi.createOrganization({
            body: {
              name: orgName,
              slug: slugify(user.email),
              userId: user.id,
              keepCurrentActiveOrganization: false,
            },
          });
          // `kind` is our column (not Better-Auth-managed), so set it directly.
          if (org?.id) {
            await db
              .update(schema.organization)
              .set({ kind })
              .where(eq(schema.organization.id, org.id));
          }
        },
      },
    },
    session: {
      create: {
        before: async (session: { userId: string }) => {
          // Hydrate the session's active org so /me and downstream contexts
          // resolve it without an extra round trip.
          const rows = await db
            .select({ orgId: schema.member.organizationId })
            .from(schema.member)
            .where(eq(schema.member.userId, session.userId))
            .limit(1);
          const first = rows[0]?.orgId;
          return first
            ? { data: { ...session, activeOrganizationId: first } }
            : { data: session };
        },
      },
    },
  },
});

export const auth = _auth as unknown as BetterAuthInstance;

// Plugin endpoints aren't on the cast base `Auth` type; narrow once here
// instead of casting at each call site.
const orgApi = auth.api as unknown as OrgApi;

export type Auth = BetterAuthInstance;
export type Session = NonNullable<Awaited<ReturnType<BetterAuthInstance['api']['getSession']>>>;
