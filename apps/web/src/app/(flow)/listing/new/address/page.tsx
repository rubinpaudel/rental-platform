'use client';

import { useRouter } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
import { Button, StackedField } from '@rental-platform/ui';
import { useFlow, type FlowAddress } from '@/features/listing-flow/flow-context';
import { FlowFooter } from '@/features/listing-flow/flow-footer';
import { useFlowGuard } from '@/features/listing-flow/hooks/use-flow-guard';
import { usePostalAutofill } from '@/features/listing-flow/hooks/use-postal-autofill';

const t = getTranslator();

function isAddressComplete(address: FlowAddress): boolean {
  return (
    address.street.trim() !== '' &&
    address.number.trim() !== '' &&
    /^\d{4}$/.test(address.postalCode) &&
    address.municipality.trim() !== ''
  );
}

export default function AddressStepPage() {
  const router = useRouter();
  const ready = useFlowGuard('address');
  const { address, setAddress } = useFlow();
  const { onPostalCodeChange, onMunicipalityBlur } = usePostalAutofill(address, setAddress);

  if (!ready) return null;

  return (
    <>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {t('listings.flow.address.title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('listings.flow.address.subtitle')}
        </p>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
          <StackedField
            id="street"
            label={t('listings.form.field.street')}
            value={address.street}
            onChange={(e) => setAddress({ street: e.target.value })}
            autoComplete="address-line1"
          />
          <StackedField
            id="number"
            label={t('listings.form.field.number')}
            value={address.number}
            onChange={(e) => setAddress({ number: e.target.value })}
          />
          <StackedField
            id="box"
            label={t('listings.form.field.box')}
            value={address.box}
            onChange={(e) => setAddress({ box: e.target.value })}
          />
          <StackedField
            id="postalCode"
            label={t('listings.form.field.postalCode')}
            value={address.postalCode}
            onChange={(e) => void onPostalCodeChange(e.target.value)}
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            autoComplete="postal-code"
          />
          <StackedField
            id="municipality"
            label={t('listings.form.field.municipality')}
            value={address.municipality}
            onChange={(e) => setAddress({ municipality: e.target.value })}
            onBlur={() => void onMunicipalityBlur()}
            autoComplete="address-level2"
          />
        </div>
      </main>

      <FlowFooter step={2} backHref="/listing/new">
        <Button
          type="button"
          disabled={!isAddressComplete(address)}
          onClick={() => router.push('/listing/new/basics')}
        >
          {t('listings.form.next')}
        </Button>
      </FlowFooter>
    </>
  );
}
