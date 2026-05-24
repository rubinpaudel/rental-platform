'use client';

import {
  Building,
  Building2,
  Castle,
  DoorOpen,
  Hotel,
  House,
  Layers,
  Square,
  TreePine,
  type LucideIcon,
} from 'lucide-react';
import { getTranslator } from '@rental-platform/i18n';
import type { TranslationKey } from '@rental-platform/i18n';
import { cn } from '@rental-platform/ui';

const t = getTranslator();

export const PROPERTY_TYPES = [
  'bungalow',
  'landhuis',
  'appartement',
  'villa',
  'kot',
  'penthouse',
  'serviceFlat',
  'duplex',
  'studio',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

const TYPE_META: Record<PropertyType, { label: TranslationKey; icon: LucideIcon }> = {
  bungalow: { label: 'listings.propertyType.bungalow', icon: House },
  landhuis: { label: 'listings.propertyType.landhuis', icon: TreePine },
  appartement: { label: 'listings.propertyType.appartement', icon: Building },
  villa: { label: 'listings.propertyType.villa', icon: Castle },
  kot: { label: 'listings.propertyType.kot', icon: DoorOpen },
  penthouse: { label: 'listings.propertyType.penthouse', icon: Building2 },
  serviceFlat: { label: 'listings.propertyType.serviceFlat', icon: Hotel },
  duplex: { label: 'listings.propertyType.duplex', icon: Layers },
  studio: { label: 'listings.propertyType.studio', icon: Square },
};

export function PropertyTypeGrid({
  value,
  onChange,
}: {
  value: PropertyType | null;
  onChange: (next: PropertyType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PROPERTY_TYPES.map((type) => {
        const { label, icon: Icon } = TYPE_META[type];
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'flex flex-col items-start gap-6 rounded-xl border bg-background p-4 text-left transition',
              selected
                ? 'border-foreground ring-1 ring-foreground'
                : 'border-border hover:border-foreground/40',
            )}
          >
            <Icon className="size-7 stroke-[1.5] text-foreground" />
            <span className="text-base font-medium text-foreground">{t(label)}</span>
          </button>
        );
      })}
    </div>
  );
}
