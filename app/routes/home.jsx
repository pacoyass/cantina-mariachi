import { useLoaderData } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Star, Clock, Truck, Smartphone, UtensilsCrossed, ShieldCheck, Sparkles } from "lucide-react";

export function meta() {
  return [
    { title: "Cantina Mariachi – Authentic Mexican, Modern Experience" },
    { name: "description", content: "Order online in seconds, reserve instantly, and track your delivery live." },
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
  const { items } = useLoaderData();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit" variant="secondary">New: Rewards launch — earn points on every order</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Authentic Mexican. <span className="text-primary">Delivered fast.</span>
            </h1>
            <p className="text-muted-foreground max-w-prose">
              From street‑style tacos to slow‑cooked specialties. Order in seconds, reserve a table instantly, and track your delivery in real time — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="px-6">Order Now</Button>
              <Button variant="secondary" className="px-6">Reserve a Table</Button>
              <a className="underline text-sm self-center" href="/menu">Browse full menu</a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (<Star key={i} className="size-4 fill-current" />))}
              </div>
              <div className="text-muted-foreground">4.9/5 from 2,400+ local diners</div>
              <Separator className="hidden md:block w-px h-5" orientation="vertical" />
              <div className="text-muted-foreground">Delivery under 35 minutes on average</div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-xl border border-border bg-card shadow-sm hero-pattern" />
            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <Card className="w-64">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Chef’s Pick</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Slow-braised barbacoa with fresh salsa verde and warm tortillas.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="mex-divider" />
      </section>

      {/* Value props */}
      <section className="container mx-auto px-6 py-12 grid gap-4 md:grid-cols-4">
        <ValueCard icon={<Clock className="size-5" />} title="Order in 30s">One tap reorder, saved favorites, and Apple/Google Pay.</ValueCard>
        <ValueCard icon={<Truck className="size-5" />} title="Live tracking">From kitchen to doorstep with minute‑by‑minute updates.</ValueCard>
        <ValueCard icon={<Smartphone className="size-5" />} title="Instant reservations">Real‑time availability, SMS confirmations, waitlist.</ValueCard>
        <ValueCard icon={<ShieldCheck className="size-5" />} title="Trusted & secure">Verified reviews, secure payments, satisfaction guaranteed.</ValueCard>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="text-sm text-muted-foreground">From craving to table in three simple steps.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Step number={1} title="Choose your favorites">Browse curated categories or search for a specific dish.</Step>
          <Step number={2} title="Customize & checkout">Add sides, pick spice level, and pay securely in seconds.</Step>
          <Step number={3} title="Track & enjoy">Follow your order live or show your reservation at the door.</Step>
        </div>
      </section>

      {/* Popular this week */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Popular this week</h2>
          <a className="text-sm underline" href="/menu">See full menu</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items && items.length > 0 ? (
            items.map((item) => (
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
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                    <Button size="sm">Add to Order</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Chef’s Special #{i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">A delicious selection coming soon.</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">$12.{i}0</span>
                    <Button size="sm">Notify me</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Social proof */}
      <section className="container mx-auto px-6 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Loved by the community</h2>
          <p className="text-sm text-muted-foreground">What guests are saying about Cantina.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Testimonial name="A. Rivera" initials="AR">“Hands‑down the best tacos in town. Ordering is so fast, and delivery always lands earlier than expected.”</Testimonial>
          <Testimonial name="M. Santos" initials="MS">“Reservations that actually work. I booked for 8pm and was seated at 8:02. Five stars.”</Testimonial>
          <Testimonial name="L. Chen" initials="LC">“The rewards program is legit. Free guac after my second order — say less.”</Testimonial>
        </div>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-6 pb-20">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--mex-green)] via-[var(--mex-gold)] to-[var(--mex-red)] p-[1px]">
            <div className="bg-background p-6 md:p-8 rounded-[calc(var(--radius)+2px)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="size-4" />
                    Limited‑time: free delivery on orders over $25
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mt-1">Skip the wait. Satisfy the craving.</h3>
                </div>
                <div className="flex gap-3">
                  <Button className="px-6">Start an Order</Button>
                  <Button variant="secondary" className="px-6">Reserve Now</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

function ValueCard({ icon, title, children }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

function Step({ number, title, children }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{number}</Badge>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

function Testimonial({ name, initials, children }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-sm text-muted-foreground mt-1">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
