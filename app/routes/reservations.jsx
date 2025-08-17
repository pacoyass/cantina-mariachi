import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export const meta = () => [
  { title: 'Reservations - Cantina' },
];

export default function ReservationsPage() {
  const { t } = useTranslation('reservations');
  return (
    <Card>
      <CardContent className="p-6 grid gap-4 max-w-xl">
        <div>
          <h1 className="text-xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <form className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm">{t('form.name')}</label>
            <Input id="name" name="name" placeholder={t('form.placeholderName')} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="phone" className="text-sm">{t('form.phone')}</label>
            <Input id="phone" name="phone" placeholder={t('form.placeholderPhone')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label htmlFor="date" className="text-sm">{t('form.date')}</label>
              <Input id="date" name="date" type="date" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="time" className="text-sm">{t('form.time')}</label>
              <Input id="time" name="time" type="time" />
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="guests" className="text-sm">{t('form.guests')}</label>
            <Input id="guests" name="guests" type="number" min={1} defaultValue={2} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="notes" className="text-sm">{t('form.notes')}</label>
            <Input id="notes" name="notes" />
          </div>
          <div className="pt-1">
            <Button type="button">{t('form.submit')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}