import { randomUUID } from 'node:crypto';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { listings } from '../../../apps/api/src/contexts/listing/infra/schema';
import { organization, user, member, account } from '../../../apps/api/src/contexts/identity/infra/schema';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set. Source .env.local or set it in the environment.');
  process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

const SEED_MARKER = 'seed-';

const existing = await db.select().from(organization).where(eq(organization.slug, `${SEED_MARKER}agency-alpha`));
if (existing.length > 0) {
  console.info('Seed data already exists — skipping.');
  await client.end();
  process.exit(0);
}

console.info('Seeding listing data...');

const now = new Date();

const orgs = [
  { id: `${SEED_MARKER}org-agency-alpha`, name: 'Alpha Vastgoed', slug: `${SEED_MARKER}agency-alpha`, kind: 'agency' },
  { id: `${SEED_MARKER}org-agency-beta`, name: 'Beta Immo Group', slug: `${SEED_MARKER}agency-beta`, kind: 'agency' },
  { id: `${SEED_MARKER}org-private-1`, name: 'Jan Janssens Verhuur', slug: `${SEED_MARKER}private-jan`, kind: 'private' },
  { id: `${SEED_MARKER}org-private-2`, name: 'Marie Peeters', slug: `${SEED_MARKER}private-marie`, kind: 'private' },
  { id: `${SEED_MARKER}org-private-3`, name: 'Pieter De Smedt', slug: `${SEED_MARKER}private-pieter`, kind: 'private' },
];

const users = [
  { id: `${SEED_MARKER}user-agency-alpha`, name: 'Alpha Agent', email: 'alpha@seed.local', role: 'landlord' },
  { id: `${SEED_MARKER}user-agency-beta`, name: 'Beta Agent', email: 'beta@seed.local', role: 'landlord' },
  { id: `${SEED_MARKER}user-jan`, name: 'Jan Janssens', email: 'jan@seed.local', role: 'landlord' },
  { id: `${SEED_MARKER}user-marie`, name: 'Marie Peeters', email: 'marie@seed.local', role: 'landlord' },
  { id: `${SEED_MARKER}user-pieter`, name: 'Pieter De Smedt', email: 'pieter@seed.local', role: 'landlord' },
];

const orgUserMap: Record<string, string> = {
  [`${SEED_MARKER}org-agency-alpha`]: `${SEED_MARKER}user-agency-alpha`,
  [`${SEED_MARKER}org-agency-beta`]: `${SEED_MARKER}user-agency-beta`,
  [`${SEED_MARKER}org-private-1`]: `${SEED_MARKER}user-jan`,
  [`${SEED_MARKER}org-private-2`]: `${SEED_MARKER}user-marie`,
  [`${SEED_MARKER}org-private-3`]: `${SEED_MARKER}user-pieter`,
};

interface ListingSeed {
  orgId: string;
  title: string;
  description: string;
  street: string;
  number: string;
  box: string | null;
  postalCode: string;
  municipality: string;
  priceCents: number;
  surfaceM2: number;
  rooms: number;
  status: string;
}

function inferPropertyType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('studio')) return 'studio';
  if (t.includes('loft')) return 'loft';
  if (
    t.includes('rijhuis') ||
    t.includes('herenhuis') ||
    t.includes('herenwoning') ||
    t.includes('rijwoning') ||
    t.includes('woning') ||
    t.includes('gezinswoning') ||
    t.includes('huis')
  )
    return 'house';
  return 'apartment';
}

const listingSeeds: ListingSeed[] = [
  // Alpha Vastgoed — Antwerp agency (15 listings)
  { orgId: orgs[0]!.id, title: 'Ruim appartement centrum Antwerpen', description: 'Prachtig gerenoveerd appartement met 2 slaapkamers in het hart van Antwerpen. Vlakbij het MAS en de Schelde.', street: 'Kloosterstraat', number: '42', box: null, postalCode: '2000', municipality: 'Antwerpen', priceCents: 95000, surfaceM2: 85, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Studio met terras Borgerhout', description: 'Lichte studio met ruim terras, ideaal voor starters. Recent gerenoveerde keuken en badkamer.', street: 'Turnhoutsebaan', number: '115', box: '3A', postalCode: '2140', municipality: 'Borgerhout', priceCents: 62000, surfaceM2: 38, rooms: 1, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Gezinswoning Berchem', description: 'Ruime rijwoning met tuin, 3 slaapkamers, garage. Rustige straat nabij park en scholen.', street: 'Generaal Lemanstraat', number: '78', box: null, postalCode: '2600', municipality: 'Berchem', priceCents: 125000, surfaceM2: 140, rooms: 3, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Loft Eilandje', description: 'Stijlvolle loft in een voormalig pakhuis op het Eilandje. Open plan met industrieel karakter.', street: 'Montevideostraat', number: '8', box: null, postalCode: '2000', municipality: 'Antwerpen', priceCents: 135000, surfaceM2: 110, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Knusse studio Zurenborg', description: 'Gezellige studio in de trendy wijk Zurenborg. Op wandelafstand van het station Berchem.', street: 'Cogels-Osylei', number: '22', box: '1', postalCode: '2600', municipality: 'Berchem', priceCents: 58000, surfaceM2: 32, rooms: 1, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Penthouse Groenplaats', description: 'Luxueus penthouse met panoramisch zicht op de kathedraal. 3 slaapkamers, 2 badkamers.', street: 'Groenplaats', number: '1', box: '10', postalCode: '2000', municipality: 'Antwerpen', priceCents: 195000, surfaceM2: 160, rooms: 3, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Appartement Linkeroever', description: 'Modern 2-slaapkamer appartement met zicht op de skyline van Antwerpen. Ondergrondse parking inbegrepen.', street: 'Sint-Annalaan', number: '56', box: null, postalCode: '2020', municipality: 'Antwerpen', priceCents: 87500, surfaceM2: 78, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Herenhuis Zuid', description: 'Statig herenhuis in het Zuid, volledig gerenoveerd met respect voor authenticiteit.', street: 'Marnixplaats', number: '14', box: null, postalCode: '2000', municipality: 'Antwerpen', priceCents: 175000, surfaceM2: 200, rooms: 4, status: 'draft' },
  { orgId: orgs[0]!.id, title: 'Duplex Deurne', description: 'Duplex appartement met privétuin. 2 slaapkamers, open keuken, apart toilet.', street: 'Frank Craeybeckxlaan', number: '30', box: null, postalCode: '2100', municipality: 'Deurne', priceCents: 89000, surfaceM2: 95, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Garage-appartement Hoboken', description: 'Praktisch appartement met ruime garage. Ideale uitvalsbasis met goede verbinding naar centrum.', street: 'Kioskplaats', number: '7', box: null, postalCode: '2660', municipality: 'Hoboken', priceCents: 72000, surfaceM2: 65, rooms: 1, status: 'inactive' },
  { orgId: orgs[0]!.id, title: 'Nieuwbouw Merksem', description: 'Instapklaar nieuwbouw appartement met balkon. Energielabel A. Lift aanwezig.', street: 'Bredabaan', number: '200', box: '5B', postalCode: '2170', municipality: 'Merksem', priceCents: 82000, surfaceM2: 72, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Studentenkamer nabij UA', description: 'Gemeubileerde studentenkamer met eigen sanitair. Alles inbegrepen.', street: 'Prinsstraat', number: '13', box: '4', postalCode: '2000', municipality: 'Antwerpen', priceCents: 45000, surfaceM2: 18, rooms: 1, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Dakappartement Wilrijk', description: 'Lichtrijk dakappartement met dakterras. Rustige ligging nabij Stadspark Nachtegalen.', street: 'Bist', number: '45', box: null, postalCode: '2610', municipality: 'Wilrijk', priceCents: 93000, surfaceM2: 88, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Instapklaar Edegem', description: 'Gerenoveerd appartement op toplocatie in Edegem. Nabij openbaar vervoer en winkels.', street: 'Drie Eikenstraat', number: '88', box: null, postalCode: '2650', municipality: 'Edegem', priceCents: 85000, surfaceM2: 75, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Gelijkvloers Mortsel', description: 'Gelijkvloers appartement met tuintje. Ideaal voor senioren of jonge gezinnen.', street: 'Statielei', number: '62', box: null, postalCode: '2640', municipality: 'Mortsel', priceCents: 78000, surfaceM2: 70, rooms: 2, status: 'draft' },

  // Beta Immo Group — Ghent + Bruges agency (15 listings)
  { orgId: orgs[1]!.id, title: 'Appartement Gent-centrum', description: 'Sfeervol appartement nabij de Graslei. 2 slaapkamers, apart toilet, grote living.', street: 'Veldstraat', number: '100', box: null, postalCode: '9000', municipality: 'Gent', priceCents: 92000, surfaceM2: 80, rooms: 2, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Rijwoning Gentbrugge', description: 'Charmante rijwoning met stadstuin. 3 slaapkamers, nieuwe CV-ketel, dubbel glas.', street: 'Braemkasteelstraat', number: '34', box: null, postalCode: '9050', municipality: 'Gentbrugge', priceCents: 105000, surfaceM2: 120, rooms: 3, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Studentenstudio Overpoort', description: 'Compacte studio in het studenten-hart van Gent. Alle voorzieningen op wandelafstand.', street: 'Overpoortstraat', number: '75', box: '2', postalCode: '9000', municipality: 'Gent', priceCents: 52000, surfaceM2: 25, rooms: 1, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Herenwoning Coupure', description: 'Prachtige herenwoning langs de Coupure. Hoge plafonds, parketvloeren, 4 slaapkamers.', street: 'Coupure', number: '210', box: null, postalCode: '9000', municipality: 'Gent', priceCents: 185000, surfaceM2: 220, rooms: 4, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Loft Dok Noord', description: 'Industriële loft in het hippe Dok Noord. Open ruimte, betonnen vloer, 3m plafonds.', street: 'Koopvaardijlaan', number: '15', box: null, postalCode: '9000', municipality: 'Gent', priceCents: 115000, surfaceM2: 100, rooms: 2, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Duplex Sint-Amandsberg', description: 'Verrassend ruime duplex met garage. 2 slaapkamers, badkamer en apart toilet per verdieping.', street: 'Antwerpsesteenweg', number: '180', box: null, postalCode: '9040', municipality: 'Sint-Amandsberg', priceCents: 88000, surfaceM2: 90, rooms: 2, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Nieuwbouw Mariakerke', description: 'BEN-woning met tuin en carport. 3 slaapkamers, open keuken, ruime living.', street: 'Mariakerkeplein', number: '5', box: null, postalCode: '9030', municipality: 'Mariakerke', priceCents: 125000, surfaceM2: 135, rooms: 3, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Studio Patershol', description: 'Authentieke studio in het historische Patershol. Gerenoveerd met behoud van karakter.', street: 'Corduwaniersstraat', number: '3', box: null, postalCode: '9000', municipality: 'Gent', priceCents: 62000, surfaceM2: 35, rooms: 1, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Appartement Brugge centrum', description: 'Sfeervolle woonst nabij de Markt van Brugge. Gerenoveerd met moderne afwerking.', street: 'Steenstraat', number: '28', box: null, postalCode: '8000', municipality: 'Brugge', priceCents: 98000, surfaceM2: 75, rooms: 2, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Rijhuis Sint-Michiels', description: 'Instapklare woning met garage en tuin. 3 slaapkamers, nabij AZ Sint-Jan.', street: 'Torhoutsesteenweg', number: '400', box: null, postalCode: '8200', municipality: 'Sint-Michiels', priceCents: 110000, surfaceM2: 130, rooms: 3, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Penthouse Brugge Zand', description: 'Exclusief penthouse met zicht op het Zand. 2 slaapkamers, luxueuze afwerking.', street: 'Zand', number: '12', box: '6', postalCode: '8000', municipality: 'Brugge', priceCents: 165000, surfaceM2: 130, rooms: 2, status: 'inactive' },
  { orgId: orgs[1]!.id, title: 'Woning Assebroek', description: 'Gezellige woning in rustige woonwijk. 3 slaapkamers, tuin, garage.', street: 'Astridlaan', number: '89', box: null, postalCode: '8310', municipality: 'Assebroek', priceCents: 95000, surfaceM2: 115, rooms: 3, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Gelijkvloers Ledeberg', description: 'Toegankelijk gelijkvloers appartement met tuin. Nabij openbaar vervoer.', street: 'Hundelgemsesteenweg', number: '55', box: null, postalCode: '9050', municipality: 'Ledeberg', priceCents: 72000, surfaceM2: 62, rooms: 1, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Duplex Wondelgem', description: 'Modern duplex-appartement in groen Wondelgem. 2 slaapkamers, ruim terras.', street: 'Wondelgemstraat', number: '22', box: null, postalCode: '9032', municipality: 'Wondelgem', priceCents: 88000, surfaceM2: 85, rooms: 2, status: 'draft' },
  { orgId: orgs[1]!.id, title: 'Dakappartement Dampoort', description: 'Lichtrijk dakappartement met dakterras nabij Dampoort station.', street: 'Oktrooiplein', number: '10', box: '4A', postalCode: '9000', municipality: 'Gent', priceCents: 78000, surfaceM2: 58, rooms: 1, status: 'active' },

  // Brussels — Private Jan (2 listings)
  { orgId: orgs[2]!.id, title: 'Appartement Flagey', description: 'Ruim 2-slaapkamer appartement nabij Flageyplein. Hoge plafonds, veel licht.', street: 'Rue de la Brasserie', number: '30', box: null, postalCode: '1050', municipality: 'Ixelles', priceCents: 110000, surfaceM2: 90, rooms: 2, status: 'active' },
  { orgId: orgs[2]!.id, title: 'Studio Sainte-Catherine', description: 'Gezellige studio in de levendige wijk Sainte-Catherine. Ideaal voor jonge professionals.', street: 'Rue de Flandre', number: '85', box: '2B', postalCode: '1000', municipality: 'Bruxelles', priceCents: 72000, surfaceM2: 35, rooms: 1, status: 'active' },

  // Leuven — Private Marie (2 listings)
  { orgId: orgs[3]!.id, title: 'Woning Kessel-Lo', description: 'Rustig gelegen woning met tuin in Kessel-Lo. 3 slaapkamers, garage, nabij Provinciaal Domein.', street: 'Diestsesteenweg', number: '350', box: null, postalCode: '3010', municipality: 'Kessel-Lo', priceCents: 115000, surfaceM2: 130, rooms: 3, status: 'active' },
  { orgId: orgs[3]!.id, title: 'Studentenstudio Naamsestraat', description: 'Gemeubileerde studio voor studenten in het centrum van Leuven. Alles inbegrepen.', street: 'Naamsestraat', number: '60', box: '7', postalCode: '3000', municipality: 'Leuven', priceCents: 48000, surfaceM2: 22, rooms: 1, status: 'active' },

  // Antwerp (extra) — Private Pieter (1 listing)
  { orgId: orgs[4]!.id, title: 'Knusse woning Kontich', description: 'Instapklare woning in het centrum van Kontich. 2 slaapkamers, tuin, recent gerenoveerd.', street: 'Sint-Martinusplaats', number: '18', box: null, postalCode: '2550', municipality: 'Kontich', priceCents: 92000, surfaceM2: 95, rooms: 2, status: 'active' },

  // Extra listings across municipalities to hit 50+
  { orgId: orgs[0]!.id, title: 'Ruime flat Mechelen', description: 'Modern 2-slaapkamer appartement in Mechelen centrum. Nabij station en winkels.', street: 'Bruul', number: '50', box: null, postalCode: '2800', municipality: 'Mechelen', priceCents: 87000, surfaceM2: 78, rooms: 2, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Woning Lier', description: 'Gezellige woning met stadstuin in het centrum van Lier. 3 slaapkamers, nieuw dak.', street: 'Grote Markt', number: '25', box: null, postalCode: '2500', municipality: 'Lier', priceCents: 98000, surfaceM2: 110, rooms: 3, status: 'active' },
  { orgId: orgs[0]!.id, title: 'Appartement Turnhout', description: 'Recent gerenoveerd appartement nabij de Grote Markt van Turnhout.', street: 'Gasthuisstraat', number: '15', box: null, postalCode: '2300', municipality: 'Turnhout', priceCents: 72000, surfaceM2: 65, rooms: 1, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Studio Kortrijk', description: 'Instapklare studio in het centrum van Kortrijk. Nabij K shopping en station.', street: 'Rijselsestraat', number: '40', box: null, postalCode: '8500', municipality: 'Kortrijk', priceCents: 55000, surfaceM2: 30, rooms: 1, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Duplex Oostende', description: 'Ruime duplex op wandelafstand van het strand. 2 slaapkamers, zeezicht.', street: 'Kapucijnenstraat', number: '70', box: null, postalCode: '8400', municipality: 'Oostende', priceCents: 95000, surfaceM2: 85, rooms: 2, status: 'active' },
  { orgId: orgs[1]!.id, title: 'Woning Roeselare', description: 'Ruime gezinswoning met tuin en garage in Roeselare centrum.', street: 'Noordstraat', number: '55', box: null, postalCode: '8800', municipality: 'Roeselare', priceCents: 88000, surfaceM2: 120, rooms: 3, status: 'active' },
  { orgId: orgs[2]!.id, title: 'Flat Schaarbeek', description: 'Licht appartement in Schaarbeek, vlakbij het Josaphatpark.', street: 'Rue Rogier', number: '120', box: '3', postalCode: '1030', municipality: 'Schaarbeek', priceCents: 82000, surfaceM2: 68, rooms: 2, status: 'active' },
  { orgId: orgs[4]!.id, title: 'Appartement Hasselt', description: 'Modern appartement in het centrum van Hasselt. 2 slaapkamers, ondergrondse parking.', street: 'Grote Markt', number: '8', box: null, postalCode: '3500', municipality: 'Hasselt', priceCents: 85000, surfaceM2: 75, rooms: 2, status: 'active' },
];

await db.transaction(async (tx) => {
  for (const u of users) {
    await tx.insert(user).values({
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: true,
      role: u.role,
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(account).values({
      id: randomUUID(),
      accountId: u.id,
      providerId: 'credential',
      userId: u.id,
      password: '$2b$10$seedhashnotforlogin000000000000000000000000000000',
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const o of orgs) {
    await tx.insert(organization).values({
      id: o.id,
      name: o.name,
      slug: o.slug,
      kind: o.kind,
      createdAt: now,
    });
    await tx.insert(member).values({
      id: randomUUID(),
      organizationId: o.id,
      userId: orgUserMap[o.id]!,
      role: 'owner',
      createdAt: now,
    });
  }

  for (const l of listingSeeds) {
    const id = randomUUID();
    const createdBy = orgUserMap[l.orgId]!;
    const region = inferRegionForSeed(l.postalCode);
    const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const createdAt = new Date(now.getTime() - offset);

    await tx.insert(listings).values({
      id,
      orgId: l.orgId,
      createdBy,
      description: `${l.title}. ${l.description}`,
      street: l.street,
      number: l.number,
      box: l.box,
      postalCode: l.postalCode,
      municipality: l.municipality,
      region,
      listingType: 'rent',
      propertyType: inferPropertyType(l.title),
      priceCents: l.priceCents,
      currency: 'EUR',
      surfaceM2: l.surfaceM2,
      bedrooms: l.rooms,
      status: l.status,
      createdAt,
      updatedAt: createdAt,
    });
  }
});

console.info(`Seeded ${orgs.length} orgs, ${users.length} users, ${listingSeeds.length} listings`);
await client.end();
process.exit(0);

function inferRegionForSeed(postalCode: string): string {
  const code = Number(postalCode);
  if (code >= 1000 && code <= 1299) return 'brussels';
  if (code >= 1300 && code <= 1499) return 'wallonia';
  if (code >= 1500 && code <= 1999) return 'flanders';
  if (code >= 2000 && code <= 3999) return 'flanders';
  if (code >= 4000 && code <= 7999) return 'wallonia';
  if (code >= 8000 && code <= 9999) return 'flanders';
  return 'flanders';
}
