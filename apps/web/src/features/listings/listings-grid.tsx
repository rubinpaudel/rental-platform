import Link from 'next/link';
import { House } from 'lucide-react';
import type { Listing } from '@/lib/listings/types';
import { formatAddress } from './format';

export function ListingsGrid({ listings }: { listings: Listing[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <li key={listing.id}>
          <Link href={`/dashboard/${listing.id}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                <House className="size-12" />
              </div>
            </div>
            <p className="mt-3 text-base text-foreground group-hover:underline">
              {formatAddress(listing.address)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
