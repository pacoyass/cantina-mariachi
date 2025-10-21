import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLoaderData } from "react-router";

export const meta = () => [
  { title: 'My Orders - Cantina' },
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

export default function OrdersLayout() {
  const { t } = useTranslation('orders');
  const { cms } = useLoaderData() || { cms: {} };
  return (
    <main className="p-12 container mx-auto">
      <h1 className="text-xl font-semibold my-10">{cms?.title || t('title')}</h1>
 
      <Outlet />
      <nav className="flex gap-3 mb-4 text-sm my-10">
        <NavLink to="/orders" className="underline-offset-4 hover:underline">{cms?.nav?.mine || t('nav.mine')}</NavLink>
        <NavLink to="/orders/track" className="underline-offset-4 hover:underline">{cms?.nav?.track || t('nav.track')}</NavLink>
      </nav>
    </main>
  );
}