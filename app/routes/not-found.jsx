export const meta = () => [
  { title: "Not Found - Cantina" },
];

export default function NotFoundPage() {
  return (
    <main className="p-4 container mx-auto">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
  );
}