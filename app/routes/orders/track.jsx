import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useLoaderData } from 'react-router';

export const meta = () => [
  { title: "Track Order - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  try {
    const lng = url.searchParams.get('lng') || request?.language || 'en';
    const res = await fetch(`${url.origin}/api/cms/orders?locale=${encodeURIComponent(lng)}`, { headers: { cookie } });
    const json = await res.json().catch(() => null);
    return { cms: json?.data?.page?.data || {} };
  } catch {
    return { cms: {} };
  }
}

export default function OrderTrackPage() {
  const { t } = useTranslation('orders');
  const { cms } = useLoaderData() || { cms: {} };
  return (
    <Card>
      <CardContent className="p-6 grid gap-4 max-w-xl">
        <div>
          <h2 className="text-lg font-semibold">{cms?.trackTitle || t('trackTitle')}</h2>
          <p className="text-sm text-muted-foreground">{cms?.trackDesc || t('trackDesc')}</p>
        </div>
        <form className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="orderNumber" className="text-sm">{cms?.trackForm?.orderNumber || t('trackForm.orderNumber')}</label>
            <Input id="orderNumber" name="orderNumber" placeholder={cms?.trackForm?.placeholderOrder || t('trackForm.placeholderOrder')} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="trackingCode" className="text-sm">{cms?.trackForm?.trackingCode || t('trackForm.trackingCode')}</label>
            <Input id="trackingCode" name="trackingCode" placeholder={cms?.trackForm?.placeholderTracking || t('trackForm.placeholderTracking')} />
          </div>
          <div className="pt-1">
            <Button type="button">{cms?.trackForm?.submit || t('trackForm.submit')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}