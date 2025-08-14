import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const meta = () => [
  { title: "Menu - Cantina" },
  { name: "description", content: "Explore our categories and items" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId") || "";
  const cookie = request.headers.get("cookie") || "";

  async function jsonOrNull(res) {
    try { return await res.json(); } catch { return null; }
  }

  const [catRes, itemsRes] = await Promise.all([
    fetch(`${url.origin}/api/menu/categories`, { headers: { cookie } }),
    fetch(`${url.origin}/api/menu/items${categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : ""}`, { headers: { cookie } }),
  ]);
  const cats = await jsonOrNull(catRes);
  const items = await jsonOrNull(itemsRes);

  return {
    categories: cats?.data?.categories ?? [],
    items: items?.data?.items ?? [],
    activeCategoryId: categoryId,
  };
}

export default function MenuPage() {
  const { categories, items, activeCategoryId } = useLoaderData();
  return (
    <main className="container mx-auto p-6 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <a href={`/menu`}></a>
            {categories.map((c) => (
              <a key={c.id} href={`/menu?categoryId=${encodeURIComponent(c.id)}`}>
                <Badge variant={activeCategoryId === c.id ? "default" : "outline"}>{c.name}</Badge>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Input placeholder="Search dishes…" className="max-w-sm" />
            <Button>Search</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.available === false && (
                      <Badge variant="outline">Unavailable</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                    <Button size="sm">Add to Order</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-muted-foreground">No items found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}