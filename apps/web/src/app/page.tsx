import { redirect } from 'next/navigation';

// The app's only home is the dashboard. Unauthenticated users are bounced to
// /sign-in by the proxy before this route's content ever renders.
export default function Home() {
  redirect('/dashboard');
}
