import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export const meta = () => [
  { title: "Track Order - Cantina" },
];

export default function OrderTrackPage() {
  const { t } = useTranslation('orders');
  return (
    <Card>
      <CardContent className="p-6 grid gap-4 max-w-xl">
        <div>
          <h2 className="text-lg font-semibold">{t('trackTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('trackDesc')}</p>
        </div>
        <form className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="orderNumber" className="text-sm">{t('trackForm.orderNumber')}</label>
            <Input id="orderNumber" name="orderNumber" placeholder={t('trackForm.placeholderOrder')} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="trackingCode" className="text-sm">{t('trackForm.trackingCode')}</label>
            <Input id="trackingCode" name="trackingCode" placeholder={t('trackForm.placeholderTracking')} />
          </div>
          <div className="pt-1">
            <Button type="button">{t('trackForm.submit')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}