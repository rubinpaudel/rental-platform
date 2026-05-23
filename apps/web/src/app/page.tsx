import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

// Placeholder home for the scaffold PR. A later PR replaces this with a
// redirect to /dashboard once the dashboard route exists.
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">{t('home.heading')}</h1>
      <p className="mt-2 text-sm">{t('home.body')}</p>
    </main>
  );
}
