# BE postal seed data

`zipcodes.json` is checked in verbatim from
[zauberware/postal-codes-json-xml-csv](https://github.com/zauberware/postal-codes-json-xml-csv/blob/master/data/BE.zip)
(BE.zip → zipcodes.be.json, renamed for the directory layout). 2,781 rows
covering 1,146 unique postcodes.

The api **does not import** this file at runtime — it lives here purely as
the input for the seed script. Each row becomes one row in the
`postal_codes` Postgres table.

## Refresh

```sh
curl -sSL https://github.com/zauberware/postal-codes-json-xml-csv/raw/master/data/BE.zip -o /tmp/BE.zip
unzip -p /tmp/BE.zip zipcodes.be.json > apps/api/src/postal/data/be/zipcodes.json
pnpm --filter @rental-platform/db db:seed-postal
```

The seed script is idempotent — it truncates the table per-country before
inserting, so a re-run picks up upstream changes without duplicates.

## Brussels naming

The dataset uses French names for Brussels-Capital communes (`Bruxelles`,
`Schaerbeek`, `Ixelles`, `Forest`, `Uccle`, `Saint-Gilles`, ...). The rest
of Flanders is Dutch (`Antwerpen`, `Brugge`, `Gent`). Brussels is
officially bilingual; landlords can edit the autofilled value if they
prefer the Dutch form.
