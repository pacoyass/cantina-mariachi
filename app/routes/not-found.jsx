export const meta = () => [
  { title: "Not Found - Cantina" },
];

import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation('common');
  return (
    <main className="p-4 container mx-auto">
      <h1>404 - {t('notFound')}</h1>
      <p>{t('resourceNotFound')}</p>
    </main>
  );
}