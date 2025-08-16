import { Outlet, NavLink } from "react-router";
import { useTranslation } from 'react-i18next';

export const meta = () => [
  { title: 'My Orders - Cantina' },
];

export default function OrdersLayout() {
  const { t } = useTranslation('orders');
  return (
    <main className="p-6 container mx-auto">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <nav className="flex gap-3 mb-4 text-sm">
        <NavLink to="/orders" className="underline-offset-4 hover:underline">{t('nav.mine')}</NavLink>
        <NavLink to="/orders/track" className="underline-offset-4 hover:underline">{t('nav.track')}</NavLink>
      </nav>
      <Outlet />
    </main>
  );
}