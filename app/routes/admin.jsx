export const meta = () => [
  { title: "Admin - Cantina" },
];

import { useTranslation } from 'react-i18next';

export default function AdminPage() {
  const { t } = useTranslation('common');
  return (
    <main className="p-4 container mx-auto">
      <h1>{t('adminTitle', { defaultValue: 'Admin' })}</h1>
      <p>{t('adminPlaceholder', { defaultValue: 'Admin dashboard placeholder.' })}</p>
    </main>
  );
}