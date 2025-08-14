export const meta = () => [
  { title: "Menu - Cantina" },
  { name: "description", content: "Explore our categories and items" },
];

export default function MenuPage() {
  return (
    <main className="p-4 container mx-auto">
      <h1>Menu</h1>
      <p>Browse categories and items.</p>
    </main>
  );
}