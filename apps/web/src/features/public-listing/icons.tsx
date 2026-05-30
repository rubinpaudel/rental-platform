import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <path d="m16 6-4-4-4 4" />
    <path d="M12 2v13" />
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </Icon>
);

export const GridIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Icon>
);

export const KeyIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7.5" cy="15.5" r="3.5" />
    <path d="m10 13 8-8" />
    <path d="m16 7 2 2" />
    <path d="m19 4 2 2" />
  </Icon>
);

export const SofaIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
    <path d="M3 13a2 2 0 0 1 2-2 2 2 0 0 1 2 2v3h10v-3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <path d="M5 19v2" />
    <path d="M19 19v2" />
  </Icon>
);

export const PawIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="1.5" />
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="17" cy="7" r="1.5" />
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
    <path d="M9 21a4 4 0 0 1-4-4c0-3 3-3 7-7 4 4 7 4 7 7a4 4 0 0 1-4 4Z" />
  </Icon>
);

export const WifiIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 13a10 10 0 0 1 14 0" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <path d="M12 20h.01" />
    <path d="M2 9.5a14 14 0 0 1 20 0" />
  </Icon>
);

export const KitchenIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <circle cx="15" cy="10" r="1.5" />
    <path d="M5 15h14" />
  </Icon>
);

export const WasherIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="14" r="4" />
    <path d="M7 7h.01" />
  </Icon>
);

export const HeatingIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 21V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13" />
    <path d="M4 13h16" />
    <path d="M8 6V3" />
    <path d="M12 6V3" />
    <path d="M16 6V3" />
  </Icon>
);

export const StorageIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8 12 3l9 5" />
    <path d="M5 8v12h14V8" />
    <path d="M9 12h6" />
  </Icon>
);

export const BikeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M6 17 10 9h5l-2-5" />
    <path d="m14 9 4 8" />
  </Icon>
);

export const GardenIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20v-8" />
    <path d="M12 12a4 4 0 0 1-4-4c0-2 4-4 4-4s4 2 4 4a4 4 0 0 1-4 4Z" />
    <path d="M4 20h16" />
  </Icon>
);

export const ShowerIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4h10a4 4 0 0 1 4 4v3" />
    <path d="M18 12V8" />
    <path d="m8 18 1-1" />
    <path d="m12 18 1-1" />
    <path d="m16 18 1-1" />
    <path d="m6 22 1-1" />
    <path d="m10 22 1-1" />
    <path d="m14 22 1-1" />
  </Icon>
);

export const BedDoubleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
    <path d="M3 18h18" />
    <path d="M3 21v-3" />
    <path d="M21 21v-3" />
    <path d="M8 9V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
  </Icon>
);

export const BedSingleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 18v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7" />
    <path d="M5 18h14" />
    <path d="M5 21v-3" />
    <path d="M19 21v-3" />
    <path d="M9 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </Icon>
);

export const MapPinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const AMENITY_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  wifi: WifiIcon,
  kitchen: KitchenIcon,
  washer: WasherIcon,
  heating: HeatingIcon,
  storage: StorageIcon,
  bike: BikeIcon,
  garden: GardenIcon,
  shower: ShowerIcon,
};
