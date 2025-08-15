import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
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
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="text-muted-foreground">No orders yet.</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div>
        <Button>Create order</Button>
      </div>
    </main>
  );
}