import { useParams } from "react-router";

export const meta = ({ params }) => [
  { title: `Order #${params.orderNumber} - Cantina` },
];

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  return (
    <main className="p-4 container mx-auto">
      <h1>Order #{orderNumber}</h1>
      <p>Order details will appear here.</p>
    </main>
  );
}