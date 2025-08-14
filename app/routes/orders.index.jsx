export const meta = () => [
  { title: "My Orders - Cantina" },
];

export default function OrdersIndexPage() {
  return (
    <main className="p-4 container mx-auto">
      <h1>My Orders</h1>
      <p>List of your recent orders will appear here.</p>
    </main>
  );
}