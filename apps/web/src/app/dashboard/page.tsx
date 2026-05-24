import { redirect } from 'next/navigation';

// Listings is the dashboard home for both agencies and private landlords —
// inbox/calendar arrive in later milestones, so there's nothing else for
// the root /dashboard URL to surface today.
export default function DashboardIndex() {
  redirect('/dashboard/listings');
}
