import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useLoaderData } from 'react-router';

export const meta = () => [
  { title: 'Reservations - Cantina' },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  try {
    const res = await fetch(`${url.origin}/api/cms/reservations?locale=${encodeURIComponent('en')}`, { headers: { cookie } });
    const json = await res.json().catch(() => null);
    return { cms: json?.data?.page?.data || {} };
  } catch {
    return { cms: {} };
  }
}

export default function ReservationsPage() {
  const { t } = useTranslation('reservations');
  const { cms } = useLoaderData() || { cms: {} };
  return (
    <Card>
      <CardContent className="p-6 grid gap-4 max-w-xl">
        <div>
          <h1 className="text-xl font-semibold">{cms?.title || t('title')}</h1>
          <p className="text-sm text-muted-foreground">{cms?.subtitle || t('subtitle')}</p>
        </div>
        <form className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm">{cms?.form?.name || t('form.name')}</label>
            <Input id="name" name="name" placeholder={cms?.form?.placeholderName || t('form.placeholderName')} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="phone" className="text-sm">{cms?.form?.phone || t('form.phone')}</label>
            <Input id="phone" name="phone" placeholder={cms?.form?.placeholderPhone || t('form.placeholderPhone')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label htmlFor="date" className="text-sm">{cms?.form?.date || t('form.date')}</label>
              <Input id="date" name="date" type="date" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="time" className="text-sm">{cms?.form?.time || t('form.time')}</label>
              <Input id="time" name="time" type="time" />
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="guests" className="text-sm">{cms?.form?.guests || t('form.guests')}</label>
            <Input id="guests" name="guests" type="number" min={1} defaultValue={2} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="notes" className="text-sm">{cms?.form?.notes || t('form.notes')}</label>
            <Input id="notes" name="notes" />
          </div>
          <div className="pt-1">
            <Button type="button">{cms?.form?.submit || t('form.submit')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}