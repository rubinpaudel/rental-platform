import Link from 'next/link';
import { Wordmark } from './wordmark';
import { UserNav } from './user-nav';

export function TopBar({ name, email }: { name: string; email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" aria-label="plekje">
          <Wordmark />
        </Link>
        <UserNav name={name} email={email} />
      </div>
    </header>
  );
}
