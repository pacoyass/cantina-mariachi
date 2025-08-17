import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useTranslation } from 'react-i18next';

export const meta = () => [
	{ title: "My Orders - Cantina" },
];

export async function loader() {
	// Placeholder; integrate with /api/orders/mine/list later
	return {
		orders: [],
	};
}

export default function OrdersIndexPage() {
	const { t } = useTranslation('orders');
	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t('table.order')}</TableHead>
							<TableHead>{t('table.status')}</TableHead>
							<TableHead>{t('table.total')}</TableHead>
							<TableHead>{t('table.date')}</TableHead>
							<TableHead>{t('table.actions')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell colSpan={5}>
								<div className="p-6 text-center text-muted-foreground text-sm">{t('empty')}</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
			<div className="p-4">
				<Button>{t('create')}</Button>
			</div>
		</Card>
	);
}