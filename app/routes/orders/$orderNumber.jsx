// import { useTranslation } from 'react-i18next';
// import { useParams } from "react-router";

// export const meta = ({ params }) => [
//   { title: `Order #${params.orderNumber} - Cantina` },
// ];


// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const path = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
// 	const cookie = request.headers.get("cookie") || "";
//   try {
//     const orderItemRes = await fetch( `${url.origin}/api/${path}`, {
//       headers: { cookie }
//     } );

//     const orderItem= await orderItemRes.json();
//     let orderError;
//     if(orderItem.error){
//       orderError=orderItem.error ||{}
//     }
//     console.log("order number",orderItem,url);
//     return {orderItem,orderError}
//   } catch (error) {
    
//   }
// }
// export default function OrderDetailPage({loaderData}) {
// const { orderNumber } = useParams();
//   const { t } = useTranslation('orders');
//   const {orderItem,orderError}=loaderData
//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold">{t('detailTitle', { orderNumber })}</h2>

//       <p className="text-sm text-muted-foreground">{t('detailPlaceholder', { defaultValue: 'Order details will appear here.' })}</p>
//     </div>
//   );
// }
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import
  {
    Card,
    CardContent,
  } from "@/components/ui/card";
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { useLoaderData, useParams } from "react-router";

export const meta = ({ params }) => [
  { title: `Order #${params.orderNumber} - Cantina` },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  try {
    const orderNumber = url.pathname.split("/").pop();

    const res = await fetch(`${url.origin}/api/orders/${orderNumber}`, {
      headers: { cookie },
    });

    if (!res.ok) throw new Error("Order not found");

    const json = await res.json();
    const order = json.data?.order || null;
    console.log("orderNumber", order);

    return { order };
  } catch (err) {
    console.error("Loader error:", err);
    return { order: null, error: err.message };
  }
}

export default function OrderDetailPage() {
  const { t } = useTranslation("orders");
  const { orderNumber } = useParams();
  const { order, error } = useLoaderData();

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>
            {t("errorTitle", { defaultValue: "Error loading order" })}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {t("notFound", { defaultValue: "Order not found." })}
      </div>
    );
  }

  const items = order?.orderItems || [];
  const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

  const getStatusBadge = (status) => {
    const map = {
      PAYMENT_DISPUTED: "bg-red-500/20 text-red-500",
      OUT_FOR_DELIVERY: "bg-blue-500/20 text-blue-500",
      COMPLETED: "bg-green-500/20 text-green-500",
      PENDING: "bg-yellow-500/20 text-yellow-500",
    };
    return map[status] || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className=" space-y-8">
      {/* ===== Header ===== */}
      <Card className="border border-muted bg-background/60 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("orderTitle", { defaultValue: `Order #${orderNumber}` })}
          </h2>

          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
            <Badge className={getStatusBadge(order.status)}>
              {order.status?.replaceAll("_", " ")}
            </Badge>
            <span>• {new Date(order.createdAt).toLocaleString()}</span>
          </div>

          <div className="pt-2">
            <p className="font-medium text-foreground">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ===== Items & Totals ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items Table */}
        <Card className="overflow-hidden border border-muted bg-background/50 rounded-2xl lg:col-span-2 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("item", { defaultValue: "Item" })}</TableHead>
                <TableHead>{t("description", { defaultValue: "Description" })}</TableHead>
                <TableHead className="text-center">{t("qty", { defaultValue: "Qty" })}</TableHead>
                <TableHead className="text-right">{t("price", { defaultValue: "Price" })}</TableHead>
                <TableHead className="text-right">{t("total", { defaultValue: "Total" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      {t("noItems", { defaultValue: "No items found for this order." })}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((i) => {
                  const name = i.menuItem?.name || "Unnamed Item";
                  const desc = i.menuItem?.description || "-";
                  const price = i.price || i.menuItem?.price || 0;
                  const total = price * (i.quantity || 0);

                  return (
                    <TableRow
                      key={i.id}
                      className="hover:bg-muted/40 transition-colors cursor-default"
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        {/* Optional placeholder image or emoji */}
                        <div className="w-6 h-6 flex items-center justify-center rounded-md bg-muted">
                          🍽️
                        </div>
                        {name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{desc}</TableCell>
                      <TableCell className="text-center">{i.quantity}</TableCell>
                      <TableCell className="text-right">{formatPrice(price)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(total)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Totals Card */}
        <Card className="border border-muted bg-background/70 p-6 rounded-2xl shadow-sm h-fit space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg text-foreground pt-1 border-t border-muted">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
