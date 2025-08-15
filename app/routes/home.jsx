import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../components/ui/hover-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
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
    <main className="space-y-0">
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

      {/* Logo cloud */}
      <section className="container mx-auto px-6 py-8">
        <div className="text-center text-xs text-muted-foreground">Trusted by local foodies and featured in</div>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-6 opacity-80">
          {['FlavorMag','EatHub','CityEats','DineNow','LocalBest'].map((name) => (
            <div key={name} className="bg-secondary text-foreground/70 rounded-md py-3 text-center text-xs">{name}</div>
          ))}
        </div>
      </section>

      {/* Explore menu (Tabs + HoverCard) */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Explore the menu</h2>
        <Tabs defaultValue="tacos" className="w-full">
          <TabsList>
            <TabsTrigger value="tacos">Tacos</TabsTrigger>
            <TabsTrigger value="bowls">Bowls</TabsTrigger>
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
          </TabsList>
          <div className="relative min-h-[150px] mt-3">
          <TabsContent value="tacos" forceMount className="absolute inset-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0,3).map((item) => (
                <HoverCard key={item.id}>
                  <HoverCardTrigger asChild>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <Badge variant="outline">${Number(item.price).toFixed(2)}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground line-clamp-2">{item.description}</CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="text-sm text-muted-foreground">Chef notes: crowd favorite with fresh cilantro and lime.</div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="bowls" forceMount className="absolute inset-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity">
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-card rounded-md border">Bowls coming soon.</div>
          </TabsContent>
          <TabsContent value="drinks" forceMount className="absolute inset-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity">
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-card rounded-md border">Drinks coming soon.</div>
          </TabsContent>
                    </div>
          </Tabs>
        </section>

      {/* Loyalty & rewards */}
      <section className="container mx-auto px-6 py-14">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Loyalty & rewards</CardTitle>
              <Badge variant="secondary">Members save more</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="text-2xl font-bold">1,250</div>
                <div className="text-muted-foreground">points</div>
              </div>
              <div className="text-right">
                <div className="font-medium">Next reward at 1,500</div>
                <div className="text-muted-foreground">Free dessert</div>
              </div>
            </div>
            <ProgressBar value={1250} max={1500} />
            <div className="mt-3 flex gap-2">
              <Button size="sm">Join rewards</Button>
              <Button size="sm" variant="outline">View perks</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Why choose us */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Why choose Cantina</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<Clock className="size-5" />} title="Faster than apps">Direct kitchen to doorstep, no third‑party delays.</FeatureCard>
          <FeatureCard icon={<ShieldCheck className="size-5" />} title="Transparent fees">No surprise charges at checkout.</FeatureCard>
          <FeatureCard icon={<Smartphone className="size-5" />} title="One‑tap reservations">Live availability and SMS confirmations.</FeatureCard>
          <FeatureCard icon={<Truck className="size-5" />} title="Live tracking">Minute‑by‑minute delivery updates.</FeatureCard>
          <FeatureCard icon={<UtensilsCrossed className="size-5" />} title="Chef‑crafted">Fresh ingredients and seasonal menus.</FeatureCard>
          <FeatureCard icon={<Sparkles className="size-5" />} title="Rewards that matter">Points on every order, instant perks.</FeatureCard>
        </div>
      </section>

      {/* Group events & catering */}
      <section className="container mx-auto px-6 py-14">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Group events & catering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-muted-foreground">Book for 8+ guests or plan office catering in minutes.</div>
              <div className="flex gap-2">
                <Button size="sm">Plan event</Button>
                <Button size="sm" variant="outline">Catering</Button>
              </div>
            </div>
            <div className="mt-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="e1">
                  <AccordionTrigger>Do you offer set menus?</AccordionTrigger>
                  <AccordionContent>Yes — set menus for groups of 8–30, with vegetarian options.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="e2">
                  <AccordionTrigger>How far in advance should I book?</AccordionTrigger>
                  <AccordionContent>We recommend 48 hours, but same‑day may be possible off‑peak.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seasonal offers */}
      <section className="container mx-auto px-6 py-14">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Seasonal offers</CardTitle>
              <Badge variant="secondary">Limited time</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Taco Tuesday Bundle</div>
                <div className="text-xl font-semibold">2 tacos + drink — $9.99</div>
                <div className="text-xs text-muted-foreground">Ends in <Countdown to={Date.now() + 1000 * 60 * 60 * 24 * 2} /></div>
              </div>
              <div className="flex gap-2">
                <Button>Order bundle</Button>
                <Button variant="outline">View details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Customer love (testimonials) */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Customer love</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Testimonial name="A. Rivera" initials="AR">“Hands‑down the best tacos in town. Ordering is so fast, and delivery always lands earlier than expected.”</Testimonial>
          <Testimonial name="M. Santos" initials="MS">“Reservations that actually work. I booked for 8pm and was seated at 8:02. Five stars.”</Testimonial>
          <Testimonial name="L. Chen" initials="LC">“The rewards program is legit. Free guac after my second order — say less.”</Testimonial>
        </div>
      </section>

      {/* Sourcing & values */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight">Sourcing & values</h3>
            <p className="text-sm text-muted-foreground">We believe in fresh, local ingredients and sustainable practices — from kitchen to table.</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Local produce</Badge>
              <Badge variant="secondary">Sustainable seafood</Badge>
              <Badge variant="secondary">Fair trade</Badge>
              <Badge variant="secondary">Low waste</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card><CardContent className="p-4 text-sm text-muted-foreground">Daily market picks</CardContent></Card>
            <Card><CardContent className="p-4 text-sm text-muted-foreground">House‑made salsas</CardContent></Card>
            <Card><CardContent className="p-4 text-sm text-muted-foreground">Locally baked tortillas</CardContent></Card>
            <Card><CardContent className="p-4 text-sm text-muted-foreground">Compostable packaging</CardContent></Card>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container mx-auto px-6 py-14 grid gap-4 md:grid-cols-4">
        <ValueCard icon={<Clock className="size-5" />} title="Order in 30s">One tap reorder, saved favorites, and Apple/Google Pay.</ValueCard>
        <ValueCard icon={<Truck className="size-5" />} title="Live tracking">From kitchen to doorstep with minute‑by‑minute updates.</ValueCard>
        <ValueCard icon={<Smartphone className="size-5" />} title="Instant reservations">Real‑time availability, SMS confirmations, waitlist.</ValueCard>
        <ValueCard icon={<ShieldCheck className="size-5" />} title="Trusted & secure">Verified reviews, secure payments, satisfaction guaranteed.</ValueCard>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 py-14">
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
      <section className="container mx-auto px-6 py-14">
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

      {/* FAQ */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>Do you offer vegetarian options?</AccordionTrigger>
            <AccordionContent>Yes, plenty! Many of our tacos and bowls have vegetarian options.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How long do deliveries take?</AccordionTrigger>
            <AccordionContent>On average, under 35 minutes depending on time and distance.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can I change my reservation?</AccordionTrigger>
            <AccordionContent>You can modify your reservation up to 2 hours before your time slot.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-6 py-16">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Limited‑time offer
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mt-1 tracking-tight">Free delivery on orders over $25</h3>
                <p className="text-sm text-muted-foreground mt-1">Order in seconds or reserve instantly — no extra fees today.</p>
              </div>
              <div className="flex gap-3">
                <Button className="px-6">Start an Order</Button>
                <Button variant="outline" className="px-6">Reserve Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div className="mx-4 mb-4 rounded-lg border bg-background shadow-md p-2 flex gap-2">
          <Button className="flex-1">Order Now</Button>
          <Button variant="outline" className="flex-1">Reserve</Button>
        </div>
      </div>
    </main>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="mt-3 h-2 w-full rounded-full bg-secondary">
      <div className="h-2 rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Countdown({ to }) {
  const [ms, setMs] = useState(Math.max(0, to - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setMs((prev) => Math.max(0, prev - 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const total = ms / 1000;
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return (<span>{d}d {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>);
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

function FeatureCard({ icon, title, children }) {
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
