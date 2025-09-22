import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useTranslation } from 'react-i18next';
import { useLoaderData } from "react-router";

export const meta = () => [
	{ title: "My Orders - Cantina" },
];

export async function loader({ request }) {
	const url = new URL(request.url);
	const cookie = request.headers.get("cookie") || "";
	const [ordersRes, cmsRes] = await Promise.all([
		fetch(`${url.origin}/api/orders/mine/list`, { headers: { cookie } }).catch(() => null),
    fetch(`${url.origin}/api/cms/orders?locale=${encodeURIComponent(request?.language || 'en')}`, { headers: { cookie } }).catch(() => null),
	]);
	const ordersJson = ordersRes ? await ordersRes.json().catch(() => null) : null;
	const cmsJson = cmsRes ? await cmsRes.json().catch(() => null) : null;
	return {
		orders: Array.isArray(ordersJson?.data) ? ordersJson.data : [],
		cms: cmsJson?.data?.page?.data || {},
	};
}

export default function OrdersIndexPage() {
  const { t } = useTranslation('orders');
	const { orders, cms } = useLoaderData();
	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{cms?.table?.order || t('table.order')}</TableHead>
							<TableHead>{cms?.table?.status || t('table.status')}</TableHead>
							<TableHead>{cms?.table?.total || t('table.total')}</TableHead>
							<TableHead>{cms?.table?.date || t('table.date')}</TableHead>
							<TableHead>{cms?.table?.actions || t('table.actions')}</TableHead>
						</TableRow>
					</TableHeader>
                <TableBody>
                {orders.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5}>
                      <div className="p-6 text-center text-muted-foreground text-sm">{cms?.empty || t('empty')}</div>
								</TableCell>
							</TableRow>
						) : orders.map((o) => (
							<TableRow key={o.id}>
								<TableCell>{o.orderNumber}</TableCell>
								<TableCell>{o.status}</TableCell>
								<TableCell>{o.total}</TableCell>
								<TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
								<TableCell>
                      <Button variant="outline" size="sm">{cms?.actions?.view || t('actions.view')}</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<div className="p-4">
				<Button>{cms?.create || t('create')}</Button>
			</div>
		</Card>
	);
}