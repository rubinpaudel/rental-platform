import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslator } from '@rental-platform/i18n';
import './globals.css';

const t = getTranslator();

export const metadata: Metadata = {
  title: t('app.title'),
  description: t('app.description'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
