import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export const meta = () => [
  { title: 'My Account - Cantina' },
];

export default function AccountPage() {
  const { t } = useTranslation('account');
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm">{t('profile.name')}</label>
            <Input id="name" name="name" placeholder="Alex Carter" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm">{t('profile.email')}</label>
            <Input id="email" name="email" type="email" placeholder="alex@example.com" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="phone" className="text-sm">{t('profile.phone')}</label>
            <Input id="phone" name="phone" placeholder="+1 555 123-4567" />
          </div>
          <div className="pt-1">
            <Button type="button">{t('profile.save')}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('security.heading')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="current" className="text-sm">{t('security.current')}</label>
            <Input id="current" name="current" type="password" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="new" className="text-sm">{t('security.new')}</label>
            <Input id="new" name="new" type="password" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirm" className="text-sm">{t('security.confirm')}</label>
            <Input id="confirm" name="confirm" type="password" />
          </div>
          <div className="pt-1">
            <Button type="button">{t('security.update')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}