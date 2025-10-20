// import { useTranslation } from 'react-i18next';
// import { useLoaderData } from "react-router";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent } from "../../components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

// export const meta = () => [
// 	{ title: "My Orders - Cantina" },
// ];

// export async function loader({ request }) {
// 	const url = new URL(request.url);
// 	const cookie = request.headers.get("cookie") || "";
// 	const [ordersRes, cmsRes] = await Promise.all([
// 		fetch(`${url.origin}/api/orders/mine/list`, { headers: { cookie } }).catch(() => null),
//     fetch(`${url.origin}/api/cms/orders?locale=${encodeURIComponent(url.searchParams.get('lng') || request?.language || 'en')}`, { headers: { cookie } }).catch(() => null),
// 	]);

	
// 	const ordersJson = ordersRes ? await ordersRes.json().catch(() => null) : null;
// 	const cmsJson = cmsRes ? await cmsRes.json().catch(() => null) : null;
// 	const  test= ordersJson?.data ? ordersJson.data : []
// 	console.log("oredres ....", test);

// 	return {
// 		orders: ordersJson?.data?.orders || [],
// 		cms: cmsJson?.data?.page?.data || {},
// 	};
// }

// export default function OrdersIndexPage() {
//   const { t } = useTranslation('orders');
// 	const { orders, cms } = useLoaderData();
// 	return (
// 		<Card className="min-h-screen">
// 			<CardContent className="p-0">
// 				<Table>
// 					<TableHeader>
// 						<TableRow>
// 							<TableHead>{cms?.table?.order || t('table.order')}</TableHead>
// 							<TableHead>{cms?.table?.status || t('table.status')}</TableHead>
// 							<TableHead>{cms?.table?.total || t('table.total')}</TableHead>
// 							<TableHead>{cms?.table?.date || t('table.date')}</TableHead>
// 							<TableHead>{cms?.table?.actions || t('table.actions')}</TableHead>
// 						</TableRow>
// 					</TableHeader>
//                 <TableBody>
//                 {orders.length === 0 ? (
// 							<TableRow>
// 								<TableCell colSpan={5}>
//                       <div className="p-6 text-center text-muted-foreground text-sm">{cms?.empty || t('empty')}</div>
// 								</TableCell>
// 							</TableRow>
// 						) : orders.map((o) => (
// 							<TableRow key={o.id}>
// 								<TableCell>{o.orderNumber}</TableCell>
// 								<TableCell>{o.status}</TableCell>
// 								<TableCell>{o.total}</TableCell>
// 								<TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
// 								<TableCell>
//                       <Button variant="outline" size="sm">{cms?.actions?.view || t('actions.view')}</Button>
// 								</TableCell>
// 							</TableRow>
// 						))}
// 					</TableBody>
// 				</Table>
// 			</CardContent>
// 			<div className="p-4">
// 				<Button>{cms?.create || t('create')}</Button>
// 			</div>
// 		</Card>
// 	);
// }

// app/routes/orders/index.jsx

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLoaderData } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import
  {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export const meta = () => [{ title: "My Orders - Cantina" }];

export async function loader({ request }) {
	const url = new URL(request.url);
	const cookie = request.headers.get("cookie") || "";
	const [ordersRes, cmsRes] = await Promise.all([
		fetch(`${url.origin}/api/orders/mine/list`, { headers: { cookie } }).catch(() => null),
    fetch(`${url.origin}/api/cms/orders?locale=${encodeURIComponent(url.searchParams.get('lng') || request?.language || 'en')}`, { headers: { cookie } }).catch(() => null),
	]);

	
	const ordersJson = ordersRes ? await ordersRes.json().catch(() => null) : null;
	const cmsJson = cmsRes ? await cmsRes.json().catch(() => null) : null;
	const  test= ordersJson?.data ? ordersJson.data : []
	console.log("oredres ....", test);

	return {
		orders: ordersJson?.data?.orders || [],
		cms: cmsJson?.data?.page?.data || {},
	};
}

export default function OrdersIndexPage() {
  const { t } = useTranslation('orders');
  const { orders, cms } = useLoaderData();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="min-h-screen">
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
              {orders?.orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      {cms?.empty || t('empty')}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.orderNumber}</TableCell>
                    <TableCell>{o.status}</TableCell>
                    <TableCell>${o.total.toFixed(2)}</TableCell>
                    <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openDialog(o)}>
                        {cms?.actions?.view || t('actions.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        <div className="p-4">
          <Button>{cms?.create || t('create')}</Button>
        </div>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t('orderDetails')}: {selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.status} • {selectedOrder?.type}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div><strong>{t('customer')}:</strong> {selectedOrder.customerName}</div>
              <div><strong>{t('email')}:</strong> {selectedOrder.customerEmail}</div>
              <div><strong>{t('phone')}:</strong> {selectedOrder.customerPhone}</div>
              <div><strong>{t('address')}:</strong> {selectedOrder.deliveryAddress}</div>
              <div><strong>{t('subtotal')}:</strong> ${selectedOrder.subtotal}</div>
              <div><strong>{t('tax')}:</strong> ${selectedOrder.tax}</div>
              <div><strong>{t('total')}:</strong> ${selectedOrder.total}</div>
              <div><strong>{t('createdAt')}:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div className="col-span-2"><strong>{t('notes')}:</strong> {selectedOrder.notes || t('none')}</div>
            </div>
          )}
          <Link variant="outline" to={`/orders/${selectedOrder?.orderNumber}`} className="text-sm mt-4">
          <Button variant="outline" className="in-focus-within:text-amber-200" >
           VIEW DETAILS 
          </Button>
          
          </Link>
          <Link variant="outline" to={`/orders/track`} className="text-sm mt-4">
          <Button variant="outline" className="in-focus-within:text-amber-200" >
           TRACK ORDER
          </Button>
          
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
