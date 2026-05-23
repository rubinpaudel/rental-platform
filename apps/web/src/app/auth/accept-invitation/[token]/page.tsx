import { AcceptInvitationView } from '@/features/auth/accept-invitation/accept-invitation-view';

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <AcceptInvitationView token={token} />;
}
