import { Table, THead, TBody, TR, TH, TD } from "../components/ui/table";
import { Button } from "../components/ui/button";

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
  return (
    <main className="container mx-auto p-6 grid gap-6">
      <h1 className="text-xl font-semibold">My Orders</h1>
      <Table>
        <THead>
          <TR>
            <TH>Order #</TH>
            <TH>Status</TH>
            <TH>Total</TH>
            <TH>Date</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD colSpan={5}>
              <div className="text-muted-foreground">No orders yet.</div>
            </TD>
          </TR>
        </TBody>
      </Table>
      <div>
        <Button>Create order</Button>
      </div>
    </main>
  );
}