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
import { useTranslation, Trans } from 'react-i18next';

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
  const { t } = useTranslation('home');

  return (
    <main className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit" variant="secondary">{t('hero.badge')}</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <Trans i18nKey="hero.title" ns="home" components={{ primary: <span className="text-primary" /> }} />
            </h1>
            <p className="text-muted-foreground max-w-prose">
              {t('hero.desc')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="px-6" aria-label={t('hero.orderNow')}>{t('hero.orderNow')}</Button>
              <Button variant="secondary" className="px-6" aria-label={t('hero.reserve')}>{t('hero.reserve')}</Button>
              <a className="underline text-sm self-center" href="/menu" aria-label={t('hero.browseMenu')}>{t('hero.browseMenu')}</a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (<Star key={i} className="size-4 fill-current" />))}
              </div>
              <div className="text-muted-foreground">{t('hero.rating')}</div>
              <Separator className="hidden md:block w-px h-5" orientation="vertical" />
              <div className="text-muted-foreground">{t('hero.avgTime')}</div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-xl border border-border bg-card shadow-sm hero-pattern" />
            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <Card className="w-64">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('hero.card.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {t('hero.card.desc')}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="mex-divider" />
      </section>

      {/* Why choose us */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('why.heading')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<Clock className="size-5" />} title={t('why.faster.title')}>{t('why.faster.desc')}</FeatureCard>
          <FeatureCard icon={<ShieldCheck className="size-5" />} title={t('why.fees.title')}>{t('why.fees.desc')}</FeatureCard>
          <FeatureCard icon={<Smartphone className="size-5" />} title={t('why.oneTap.title')}>{t('why.oneTap.desc')}</FeatureCard>
          <FeatureCard icon={<Truck className="size-5" />} title={t('why.tracking.title')}>{t('why.tracking.desc')}</FeatureCard>
          <FeatureCard icon={<UtensilsCrossed className="size-5" />} title={t('why.chef.title')}>{t('why.chef.desc')}</FeatureCard>
          <FeatureCard icon={<Sparkles className="size-5" />} title={t('why.rewards.title')}>{t('why.rewards.desc')}</FeatureCard>
        </div>
      </section>

      {/* Logo cloud */}
      <section className="container mx-auto px-6 py-8">
        <div className="text-center text-xs text-muted-foreground">{t('logo.heading')}</div>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-6 opacity-80">
          {['FlavorMag','EatHub','CityEats','DineNow','LocalBest'].map((name) => (
            <div key={name} className="bg-secondary text-foreground/70 rounded-md py-3 text-center text-xs">{name}</div>
          ))}
        </div>
      </section>

      {/* Explore menu (Tabs + HoverCard) */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('explore.heading')}</h2>
        <Tabs defaultValue="tacos" className="w-full">
          <TabsList>
            <TabsTrigger value="tacos">{t('explore.tacos')}</TabsTrigger>
            <TabsTrigger value="bowls">{t('explore.bowls')}</TabsTrigger>
            <TabsTrigger value="drinks">{t('explore.drinks')}</TabsTrigger>
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
                    <div className="text-sm text-muted-foreground">{t('explore.chefNotes')}</div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
            <div className="mt-3">
              <a className="text-sm underline" href="/menu" aria-label={t('explore.viewMore')}>{t('explore.viewMore')}</a>
            </div>
          </TabsContent>
          <TabsContent value="bowls" forceMount className="absolute inset-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity">
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-card rounded-md border">{t('explore.coming')}</div>
          </TabsContent>
          <TabsContent value="drinks" forceMount className="absolute inset-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity">
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-card rounded-md border">{t('explore.coming')}</div>
          </TabsContent>
                    </div>
          </Tabs>
        </section>

      {/* Loyalty & rewards */}
      <section className="container mx-auto px-6 py-14">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('loyalty.heading')}</CardTitle>
              <Badge variant="secondary">{t('loyalty.membersSave')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="text-2xl font-bold">1,250</div>
                <div className="text-muted-foreground">{t('loyalty.points')}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{t('loyalty.nextAt', { points: 1500 })}</div>
                <div className="text-muted-foreground">{t('loyalty.freeDessert')}</div>
              </div>
            </div>
            <ProgressBar value={1250} max={1500} />
            <div className="mt-3 flex gap-2">
              <Button size="sm">{t('loyalty.join')}</Button>
              <Button size="sm" variant="outline">{t('loyalty.perks')}</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Group events & catering */}
      <section className="container mx-auto px-6 py-14">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('events.heading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[1fr_320px] md:items-center">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-muted-foreground">{t('events.desc')}</div>
                  <div className="flex gap-2">
                    <Button size="sm">{t('events.plan')}</Button>
                    <Button size="sm" variant="outline">{t('events.catering')}</Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="e1">
                      <AccordionTrigger>{t('events.q1.question')}</AccordionTrigger>
                      <AccordionContent>{t('events.q1.answer')}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="e2">
                      <AccordionTrigger>{t('events.q2.question')}</AccordionTrigger>
                      <AccordionContent>{t('events.q2.answer')}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
              <div className="rounded-md overflow-hidden border bg-muted">
                <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seasonal offers */}
      <section className="container mx-auto px-6 py-14">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('offers.heading')}</CardTitle>
              <Badge variant="secondary">{t('offers.badge')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[320px_1fr] md:items-center">
              <div className="rounded-md overflow-hidden border bg-muted">
                <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t('offers.bundle')}</div>
                  <div className="text-xl font-semibold">{t('offers.deal')}</div>
                  <div className="text-xs text-muted-foreground">{t('offers.endsIn')} <Countdown to={Date.now() + 1000 * 60 * 60 * 24 * 2} /></div>
                </div>
                <div className="flex gap-2">
                  <Button>{t('offers.orderBundle')}</Button>
                  <Button variant="outline">{t('offers.viewDetails')}</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Customer love (testimonials) */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('testimonials.heading')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Testimonial name="A. Rivera" initials="AR">{t('testimonials.t1')}</Testimonial>
          <Testimonial name="M. Santos" initials="MS">{t('testimonials.t2')}</Testimonial>
          <Testimonial name="L. Chen" initials="LC">{t('testimonials.t3')}</Testimonial>
        </div>
      </section>

      {/* Sourcing & values */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight">{t('values.heading')}</h3>
            <p className="text-sm text-muted-foreground">{t('values.desc')}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{t('values.badges.localProduce')}</Badge>
              <Badge variant="secondary">{t('values.badges.sustainableSeafood')}</Badge>
              <Badge variant="secondary">{t('values.badges.fairTrade')}</Badge>
              <Badge variant="secondary">{t('values.badges.lowWaste')}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="overflow-hidden"><CardContent className="p-0"><div className="w-full aspect-video bg-muted border" /><div className="p-3 text-sm text-muted-foreground">{t('values.cards.dailyMarket')}</div></CardContent></Card>
            <Card className="overflow-hidden"><CardContent className="p-0"><div className="w-full aspect-video bg-muted border" /><div className="p-3 text-sm text-muted-foreground">{t('values.cards.houseSalsas')}</div></CardContent></Card>
            <Card className="overflow-hidden"><CardContent className="p-0"><div className="w-full aspect-video bg-muted border" /><div className="p-3 text-sm text-muted-foreground">{t('values.cards.localTortillas')}</div></CardContent></Card>
            <Card className="overflow-hidden"><CardContent className="p-0"><div className="w-full aspect-video bg-muted border" /><div className="p-3 text-sm text-muted-foreground">{t('values.cards.compostablePackaging')}</div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container mx-auto px-6 py-14 grid gap-4 md:grid-cols-4">
        <ValueCard icon={<Clock className="size-5" />} title={t('explore.tacos')}>{t('value.reorderDesc')}</ValueCard>
        <ValueCard icon={<Truck className="size-5" />} title={t('why.tracking.title')}>{t('why.tracking.desc')}</ValueCard>
        <ValueCard icon={<Smartphone className="size-5" />} title={t('why.oneTap.title')}>{t('why.oneTap.desc')}</ValueCard>
        <ValueCard icon={<ShieldCheck className="size-5" />} title={t('value.trustedTitle')}>{t('value.trustedDesc')}</ValueCard>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 py-14">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">{t('how.heading')}</h2>
          <p className="text-sm text-muted-foreground">{t('how.desc')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Step number={1} title={t('how.step1.title')}>{t('how.step1.desc')}</Step>
          <Step number={2} title={t('how.step2.title')}>{t('how.step2.desc')}</Step>
          <Step number={3} title={t('how.step3.title')}>{t('how.step3.desc')}</Step>
        </div>
      </section>

      {/* Popular this week */}
      <section className="container mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t('popular.heading')}</h2>
          <a className="text-sm underline" href="/menu">{t('popular.seeMenu')}</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items && items.length > 0 ? (
            items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <span>{item.name}</span>
                      <div className="flex gap-1">
                        {Number(item.orderCount ?? item.popularity ?? 0) > 50 && <Badge variant="secondary">{t('badges.popular', { ns: 'menu' })}</Badge>}
                      </div>
                    </CardTitle>
                    {item.available === false && (
                      <Badge variant="outline">{t('popular.unavailable')}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-md overflow-hidden border bg-muted">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-full h-full object-cover aspect-video" />
                      ) : (
                        <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" aria-hidden="true" />)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                      <Button size="sm">{t('popular.add')}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{t('popular.chefSpecial', { num: i + 1 })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-md overflow-hidden border bg-muted">
                      <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{t('popular.coming')}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">$12.{i}0</span>
                      <Button size="sm">{t('popular.notify')}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('faq.heading')}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>{t('faq.q1.question')}</AccordionTrigger>
            <AccordionContent>{t('faq.q1.answer')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>{t('faq.q2.question')}</AccordionTrigger>
            <AccordionContent>{t('faq.q2.answer')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>{t('faq.q3.question')}</AccordionTrigger>
            <AccordionContent>{t('faq.q3.answer')}</AccordionContent>
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
                  {t('cta.limited')}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mt-1 tracking-tight">{t('cta.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('cta.desc')}</p>
              </div>
              <div className="flex gap-3">
                <Button className="px-6">{t('cta.start')}</Button>
                <Button variant="outline" className="px-6">{t('cta.reserve')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div className="mx-4 mb-4 rounded-lg border bg-background shadow-md p-2 flex gap-2">
          <Button className="flex-1">{t('sticky.order')}</Button>
          <Button variant="outline" className="flex-1">{t('sticky.reserve')}</Button>
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
    <Card className="overflow-hidden">
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
    <Card className="overflow-hidden">
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
    <Card className="overflow-hidden">
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
