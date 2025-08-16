import { useTranslation } from 'react-i18next';

export const meta = () => [
  { title: "Track Order - Cantina" },
];

export default function OrderTrackPage() {
  const { t } = useTranslation('orders');
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{t('trackTitle')}</h2>
      <p className="text-sm text-muted-foreground">{t('trackDesc')}</p>
    </div>
  );
}