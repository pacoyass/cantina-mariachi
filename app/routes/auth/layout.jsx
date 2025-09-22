import { Outlet } from "react-router";
import { useTranslation } from 'react-i18next';

export const meta = () => [{ title: "Auth - Cantina" }];

export default function AuthLayout() {
  const { t } = useTranslation('auth');
  return (
    <main className="p-4 container mx-auto">
      <h1>{t('title', { defaultValue: 'Authentication' })}</h1>
      <Outlet />
    </main>
  );
}