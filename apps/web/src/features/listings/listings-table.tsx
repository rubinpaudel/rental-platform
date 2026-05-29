import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { Listing } from '@/lib/listings/types';
import { formatAddress, formatDate, formatPrice } from './format';
import { StatusToggle } from './status-toggle';

const t = getTranslator();

export function ListingsTable({ listings }: { listings: Listing[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('listings.table.title')}</TableHead>
            <TableHead>{t('listings.table.address')}</TableHead>
            <TableHead>{t('listings.table.status')}</TableHead>
            <TableHead className="text-right">{t('listings.table.price')}</TableHead>
            <TableHead className="text-right">{t('listings.table.views')}</TableHead>
            <TableHead className="text-right">{t('listings.table.applications')}</TableHead>
            <TableHead>{t('listings.table.updated')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium text-foreground">
                <Link
                  href={`/dashboard/listings/${listing.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {listing.displayLabel}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatAddress(listing.address)}
              </TableCell>
              <TableCell>
                <StatusToggle listingId={listing.id} status={listing.status} />
              </TableCell>
              <TableCell className="text-right">{formatPrice(listing.pricing.priceCents)}</TableCell>
              {/* Analytics + applications land in later milestones (v9). */}
              <TableCell className="text-right text-muted-foreground">—</TableCell>
              <TableCell className="text-right text-muted-foreground">0</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(listing.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
