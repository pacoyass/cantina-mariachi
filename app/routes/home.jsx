import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function meta() {
  return [
    { title: "Cantina Mariachi – Authentic Mexican, Modern Experience" },
    { name: "description", content: "Order online, reserve tables, and track orders in real-time." },
  ];
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  try {
    const res = await fetch(`${url.origin}/api/menu/items`, { headers: { cookie } });
    const data = await res.json().catch(() => ({}));
    const items = Array.isArray(data?.data?.items) ? data.data.items.slice(0, 6) : [];
    return { items };
  } catch {
    return { items: [] };
  }
}

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Authentic Mexican, crafted fresh. Delivered fast.
            </h1>
            <p className="text-muted-foreground max-w-prose">
              From street-style tacos to slow-cooked specialties, enjoy a seamless ordering and reservation experience.
            </p>
            <div className="flex gap-3">
              <Button>Order Now</Button>
              <Button variant="secondary">View Menu</Button>
            </div>
            <div className="flex gap-2 pt-2">
              <Badge>Free delivery over $25</Badge>
              <Badge variant="outline">Open today 11:00–23:00</Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-video rounded-xl border border-border bg-card shadow-sm" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Reserve Easily</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">Book a table in seconds with live availability.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Track Your Order</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">Real-time updates from kitchen to doorstep.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Fresh Ingredients</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">Sourced daily and prepared to perfection.</CardContent>
          </Card>
        </div>
      </section>

      <FeaturedItems />
    </main>
  );
}

function FeaturedItems() {
  // For now, we reuse the loader on the server to fetch items; in the client this will revalidate
  // We avoid useLoaderData here to keep the component simple; could be wired later.
  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Popular this week</h2>
        <a className="text-sm underline" href="/menu">See all</a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Featured Dish #{i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">A delicious chef selection.</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">$12.{i}0</span>
                <Button size="sm">Add to Order</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
