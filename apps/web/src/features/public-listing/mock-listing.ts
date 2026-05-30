export interface PublicListing {
  id: string;
  title: string;
  municipality: string;
  region: 'Vlaanderen' | 'Brussel' | 'Wallonië';
  rooms: number;
  surfaceM2: number;
  baths: number;
  priceCents: number;
  chargesCents: number;
  depositCents: number;
  availableFrom: string;
  furnished: boolean;
  petsAllowed: boolean;
  description: string;
  epcLabel: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  epcKwh: number;
  photos: { src: string; alt: string }[];
  amenities: { key: string; label: string }[];
  bedrooms: { kind: 'queen' | 'single'; label: string }[];
  host: {
    name: string;
    kind: 'agency' | 'private';
    sinceYear: number;
    responseRatePct: number;
    responseTime: string;
  };
}

export const mockListing: PublicListing = {
  id: 'demo-gent-1',
  title: 'Lichte 2-slaapkamer in centrum Gent',
  municipality: 'Gent',
  region: 'Vlaanderen',
  rooms: 2,
  surfaceM2: 85,
  baths: 1,
  priceCents: 115_000,
  chargesCents: 9_500,
  depositCents: 230_000,
  availableFrom: '1 juli 2026',
  furnished: true,
  petsAllowed: true,
  description:
    'Een gerenoveerd appartement op de tweede verdieping van een herenhuis aan de Sint-Pietersnieuwstraat, op vijf minuten wandelen van het Citadelpark en de Korenmarkt. De woonkamer kijkt uit op een rustige binnentuin; de keuken is volledig uitgerust met inductiekookplaat, oven, vaatwasser en koel-vriescombinatie. Twee ruime slaapkamers, een ingerichte badkamer met inloopdouche, en een aparte berging met aansluiting voor de wasmachine. Verwarming via centrale gasketel; recent EPC-label B na vervanging van de ramen in 2024. Fietsenstalling in de inkomhal, kelderberging inbegrepen.',
  epcLabel: 'B',
  epcKwh: 145,
  photos: [
    {
      src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      alt: 'Woonkamer met grote ramen en zithoek',
    },
    {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      alt: 'Open keuken met inductiekookplaat',
    },
    {
      src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
      alt: 'Eethoek bij raam',
    },
    {
      src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      alt: 'Hoofdslaapkamer met tweepersoonsbed',
    },
    {
      src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
      alt: 'Badkamer met inloopdouche',
    },
  ],
  amenities: [
    { key: 'wifi', label: 'Glasvezel internet' },
    { key: 'kitchen', label: 'Volledig uitgeruste keuken' },
    { key: 'washer', label: 'Aansluiting wasmachine' },
    { key: 'heating', label: 'Centrale verwarming op gas' },
    { key: 'storage', label: 'Kelderberging' },
    { key: 'bike', label: 'Fietsenstalling' },
    { key: 'garden', label: 'Uitzicht op binnentuin' },
    { key: 'shower', label: 'Inloopdouche' },
  ],
  bedrooms: [
    { kind: 'queen', label: 'Slaapkamer 1' },
    { kind: 'single', label: 'Slaapkamer 2' },
  ],
  host: {
    name: 'Vandevelde Vastgoed',
    kind: 'agency',
    sinceYear: 2021,
    responseRatePct: 98,
    responseTime: '4 uur',
  },
};
