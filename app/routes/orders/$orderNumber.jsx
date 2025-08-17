import { useParams } from "react-router";
import { useTranslation } from 'react-i18next';

export const meta = ({ params }) => [
  { title: `Order #${params.orderNumber} - Cantina` },
];

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  const { t } = useTranslation('orders');
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{t('detailTitle', { orderNumber })}</h2>
      <p className="text-sm text-muted-foreground">Order details will appear here.</p>
    </div>
  );
}