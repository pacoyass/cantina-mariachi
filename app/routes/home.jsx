import { useLoaderData, Link, Await, ScrollRestoration } from "react-router";
import { Suspense, useEffect, useMemo, useRef, useState, lazy } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { Star, Clock, Truck, Smartphone, UtensilsCrossed, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation, Trans } from 'react-i18next';
import { formatCurrency, track } from '../lib/utils'

export function meta() {
  return [
    { title: "Cantina Mariachi – Authentic Mexican, Modern Experience" },
    { name: "description", content: "Order online in seconds, reserve instantly, and track your delivery live." },
    { property: 'og:title', content: 'Cantina Mariachi – Authentic Mexican, Modern Experience' },
    { property: 'og:description', content: 'Order online in seconds, reserve instantly, and track your delivery live.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { rel: 'canonical', href: '/' },
  ];
}

// JSON-LD for LocalBusiness + Product snippets
function JsonLd({ items }) {
  const business = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: 'Cantina Mariachi', url: '/', servesCuisine: 'Mexican', priceRange: '$$'
  };
  const products = (items || []).slice(0,3).map(i => ({ '@context': 'https://schema.org', '@type': 'Product', name: i.name, description: i.description, offers: { '@type': 'Offer', price: Number(i.price || 0), priceCurrency: 'USD', availability: i.isAvailable === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } }));
  const json = [business, ...products];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const headers = { cookie };
  const itemsPromise = (async () => {
    try {
      const res = await fetch(`${url.origin}/api/menu/items`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data?.data?.items) ? data.data.items.slice(0, 6) : [];
      return items;
    } catch {
      return [];
    }
  })();
  const offersPromise = (async () => {
    try {
      const res = await fetch(`${url.origin}/api/home/offers`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data?.offers) ? data.data.offers : [];
    } catch {
      return [];
    }
  })();
  const testimonialsPromise = (async () => {
    try {
      const res = await fetch(`${url.origin}/api/home/testimonials`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data?.testimonials) ? data.data.testimonials : [];
    } catch {
      return [];
    }
  })();
  const drinksPromise = (async () => {
    try {
      const catRes = await fetch(`${url.origin}/api/menu/categories`, { headers });
      if (!catRes.ok) throw new Error(`HTTP ${catRes.status}`);
      const catJson = await catRes.json();
      const categories = Array.isArray(catJson?.data?.categories) ? catJson.data.categories : [];
      const drinksCat = categories.find(c => c.name.toLowerCase() === 'drinks');
      if (!drinksCat?.id) return [];
      const itemsRes = await fetch(`${url.origin}/api/menu/items?categoryId=${encodeURIComponent(drinksCat.id)}&available=true`, { headers });
      if (!itemsRes.ok) throw new Error(`HTTP ${itemsRes.status}`);
      const itemsJson = await itemsRes.json();
      return Array.isArray(itemsJson?.data?.items) ? itemsJson.data.items.slice(0, 6) : [];
    } catch {
      return [];
    }
  })();
  const configPromise = (async () => {
    try {
      const res = await fetch(`${url.origin}/api/config/public`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data?.data || {};
    } catch {
      return {};
    }
  })();
  const cmsPromise = (async () => {
    try {
      const res = await fetch(`${url.origin}/api/cms/home?locale=${encodeURIComponent('en')}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data?.data?.page?.data || {};
    } catch {
      return {};
    }
  })();
  return {
    items: itemsPromise,
    offers: offersPromise,
    testimonials: testimonialsPromise,
    drinks: drinksPromise,
    config: configPromise,
    cms: cmsPromise,
  };
}

const LazyFAQ = lazy(() => import("../components/home/FAQ.jsx"));
const LazyTestimonials = lazy(() => import("../components/home/Testimonials.jsx"));
const LazyOffers = lazy(() => import("../components/home/Offers.jsx"));

export default function Home() {
  const { items, offers, testimonials, drinks, config, cms } = useLoaderData();
  const { t, i18n } = useTranslation('home');

  return (
    <main className="space-y-0">
      <Suspense>
        <Await resolve={items}>{(resolved) => <JsonLd items={resolved} />}</Await>
      </Suspense>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit" variant="secondary">{cms?.hero?.badge || t('hero.badge')}</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {cms?.hero?.title ? <span dangerouslySetInnerHTML={{ __html: cms.hero.title }} /> : <Trans i18nKey="hero.title" ns="home" components={{ primary: <span className="text-primary" /> }} />}
            </h1>
            <p className="text-muted-foreground max-w-prose">
              {cms?.hero?.desc || t('hero.desc')}
            </p>
            <div className="flex items-center gap-3 text-sm" aria-live="polite">
              <Suspense fallback={null}>
                <Await resolve={config}>{(c) => (
                  <>
                    <span className={c?.status?.isOpen ? 'text-green-600' : 'text-red-600'}>
                      {c?.status?.isOpen ? t('hero.openNow', { defaultValue: 'Open now' }) : t('hero.closedNow', { defaultValue: 'Closed now' })}
                    </span>
                    <Separator className="w-px h-4" orientation="vertical" />
                    <span>{t('hero.eta', { defaultValue: 'ETA ~ {{m}}m', m: c?.status?.etaMins ?? 25 })}</span>
                  </>
                )}</Await>
              </Suspense>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="px-6" aria-label={t('hero.orderNow')} onClick={() => track('click_order_now_hero')}>{t('hero.orderNow')}</Button>
              <Button variant="secondary" className="px-6" aria-label={t('hero.reserve')} onClick={() => track('click_reserve_hero')}>{t('hero.reserve')}</Button>
              <Link className="underline text-sm self-center" to="/menu" aria-label={t('hero.browseMenu')} onClick={() => track('click_browse_menu_hero')}>{t('hero.browseMenu')}</Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500" aria-label={t('hero.rating')}>
                {[...Array(5)].map((_, i) => (<Star key={i} className="size-4 fill-current" />))}
              </div>
              <div className="text-muted-foreground" aria-live="polite">{t('hero.avgTime')}</div>
              <Separator className="hidden md:block w-px h-5" orientation="vertical" />
              <div className="text-muted-foreground">{t('hero.avgTime')}</div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <picture>
                <source srcSet="/hero.avif" type="image/avif" />
                <source srcSet="/hero.webp" type="image/webp" />
                <img src="/hero.jpg" alt="Colorful tacos platter with fresh ingredients" loading="eager" width="1200" height="900" className="w-full h-full object-cover" />
              </picture>
            </div>
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

      {/* Explore menu (Tabs) */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('explore.heading')}</h2>
        <Tabs defaultValue="tacos" className="w-full">
          <TabsList>
            <TabsTrigger value="tacos">{t('explore.tacos')}</TabsTrigger>
            <TabsTrigger value="bowls">{t('explore.bowls')}</TabsTrigger>
            <TabsTrigger value="drinks">{t('explore.drinks')}</TabsTrigger>
          </TabsList>
          <div className="mt-3">
          <TabsContent value="tacos" forceMount className="data-[state=inactive]:hidden data-[state=active]:block transition-opacity">
            <Suspense fallback={<MenuItemsSkeleton count={3} />}>
              <Await resolve={items} errorElement={<MenuItemsError message={t('popular.coming')} />}>
                {(resolvedItems) => (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resolvedItems.slice(0,3).map((item) => (
                      <MenuItemCard key={item.id} item={item} t={t} locale={i18n.language} />
                    ))}
                  </div>
                )}
              </Await>
            </Suspense>
            <div className="mt-3">
              <Link className="text-sm underline" to="/menu" aria-label={t('explore.viewMore')} onClick={() => track('click_view_more_explore')}>{t('explore.viewMore')}</Link>
            </div>
          </TabsContent>
          <TabsContent value="bowls" forceMount className="data-[state=inactive]:hidden data-[state=active]:block transition-opacity">
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-card rounded-md border">{t('explore.coming')}</div>
          </TabsContent>
          <TabsContent value="drinks" forceMount className="data-[state=inactive]:hidden data-[state=active]:block transition-opacity">
            <Suspense fallback={<MenuItemsSkeleton count={3} />}>
              <Await resolve={drinks} errorElement={<MenuItemsError message={t('explore.coming')} />}>
                {(resolvedDrinks) => (
                  resolvedDrinks?.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {resolvedDrinks.slice(0,3).map((item) => (
                        <MenuItemCard key={item.id} item={item} t={t} locale={i18n.language} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-card rounded-md border">{t('explore.coming')}</div>
                  )
                )}
              </Await>
            </Suspense>
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

      {/* Seasonal offers (lazy) */}
      <section className="container mx-auto px-6 py-14">
        <Suspense fallback={<SectionSkeleton title={t('offers.heading')} />}> 
          <Await resolve={offers} errorElement={<SectionError title={t('offers.heading')} />}> 
            {(resolvedOffers) => (
              <LazyOffers offers={resolvedOffers} t={t} />
            )}
          </Await>
        </Suspense>
      </section>

      {/* Customer love (testimonials) lazy */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('testimonials.heading')}</h2>
        <Suspense fallback={<SectionSkeleton title={t('testimonials.heading')} />}> 
          <Await resolve={testimonials} errorElement={<SectionError title={t('testimonials.heading')} />}> 
            {(resolvedTestimonials) => (
              <CarouselTestimonials testimonials={resolvedTestimonials} />
            )}
          </Await>
        </Suspense>
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
          <Link className="text-sm underline" to="/menu" onClick={() => track('click_view_menu_popular')}>{t('popular.seeMenu')}</Link>
        </div>
        <Suspense fallback={<MenuItemsSkeleton count={3} />}>
          <Await resolve={items} errorElement={<MenuItemsError message={t('popular.coming')} />}>
            {(resolvedItems) => (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resolvedItems && resolvedItems.length > 0 ? (
                  resolvedItems.slice(0,3).map((item, idx) => (
                    <PopularItemCard key={item.id} item={item} idx={idx} t={t} locale={i18n.language} />
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
                            <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" aria-hidden="true" />
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
            )}
          </Await>
        </Suspense>
      </section>

      {/* FAQ (lazy) */}
      <section className="container mx-auto px-6 py-14">
        <Suspense fallback={<SectionSkeleton title={t('faq.heading')} />}> 
          <LazyFAQ t={t} />
        </Suspense>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-6 py-16">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="size-4 text-primary" />
                  {cms?.cta?.endsTonight || t('cta.endsTonight')}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mt-1 tracking-tight">{cms?.cta?.title || t('cta.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cms?.cta?.desc || t('cta.desc')}</p>
                <div className="text-xs text-muted-foreground mt-1">{cms?.cta?.socialProof || t('cta.socialProof')}</div>
                <div className="text-xs text-primary mt-1" aria-live="polite">{cms?.cta?.limited || t('cta.limited')} · ⏰ <Countdown to={Date.now() + 1000 * 60 * 60 * 4} /></div>
              </div>
              <div className="flex gap-3">
                <Button className="px-6" onClick={() => track('click_start_cta')}>{cms?.cta?.start || t('cta.start')}</Button>
                <Button variant="outline" className="px-6" onClick={() => track('click_reserve_cta')}>{cms?.cta?.reserve || t('cta.reserve')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div className="mx-4 mb-4 rounded-lg border bg-background shadow-md p-2 flex gap-2">
          <Button className="flex-1" onClick={() => track('click_order_now_mobile_sticky')}>{t('sticky.order')}</Button>
          <Button variant="outline" className="flex-1" onClick={() => track('click_reserve_mobile_sticky')}>{t('sticky.reserve')}</Button>
        </div>
      </div>
      <ScrollRestoration />
    </main>
  );
}

function MenuItemCard({ item, t, locale }) {
  const tags = [item.isVegetarian ? 'Vegetarian' : null, item.isVegan ? 'Vegan' : null].filter(Boolean)
  return (
    <Card key={item.id} className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{item.name}</span>
          <span className="flex gap-1">{tags.map(tag => (<Badge key={tag} variant="outline">{tag}</Badge>))}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-md overflow-hidden border bg-muted">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={`${item.name} dish`} loading="lazy" width="640" height="360" className="w-full h-full object-cover aspect-video" />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" aria-hidden="true" />)}
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-medium">{formatCurrency(item.price, locale)}</span>
            <Button size="sm" onClick={() => track('click_add_from_explore', { itemId: item.id })}>{t('popular.add')}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PopularItemCard({ item, idx, t, locale }) {
  const tags = [item.isVegetarian ? 'Vegetarian' : null, item.isVegan ? 'Vegan' : null].filter(Boolean)
  return (
    <Card key={item.id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <span>{item.name}</span>
            <div className="flex gap-1">
              {idx === 0 && <Badge variant="secondary">{t('popular.numberOne')}</Badge>}
              {Number(item.orderCount ?? item.popularity ?? 0) > 50 && <Badge variant="secondary">{t('popular.trending')}</Badge>}
              {tags.map(tag => (<Badge key={tag} variant="outline">{tag}</Badge>))}
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
              <img src={item.imageUrl} alt={`${item.name} dish`} loading="lazy" width="640" height="360" className="w-full h-full object-cover aspect-video" />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" aria-hidden="true" />)}
          </div>
          <div className="text-xs text-muted-foreground" aria-live="polite">
            {t('popular.rating', { rating: (item.rating ?? 4.9).toFixed(1), reviews: item.reviews ?? 127 })}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-medium">{formatCurrency(item.price, locale)}</span>
            <div className="flex items-center gap-2">
              <div className="text-xs text-orange-600">
                {t('popular.onlyLeftToday', { count: Math.max(2, 10 - (item.orderCount ?? 3)) })}
              </div>
              <Button size="sm" onClick={() => track('click_order_delivery_popular', { itemId: item.id })}>{t('popular.orderNowDelivery', { mins: 25 })}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CarouselTestimonials({ testimonials }) {
  const [idx, setIdx] = useState(0)
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : true
  useEffect(() => {
    if (!isMobile) return
    const id = setInterval(() => setIdx(i => (i + 1) % Math.max(testimonials.length, 1)), 4000)
    return () => clearInterval(id)
  }, [isMobile, testimonials?.length])
  const slice = isMobile ? testimonials.slice(idx, idx + 1) : testimonials
  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
      {slice.map((t) => (
        <Card key={t.id} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{t.initials || (t.name || '?').slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{t.name} <span className="ml-1 text-xs text-green-600">Verified</span></div>
                  <div className="flex items-center gap-1 text-yellow-500" aria-label={`${t.rating} stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3 ${i < Number(t.rating || 0) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{t.content} <Link to="/reviews" className="underline">Read more</Link></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProgressBar({ value, max }) {
  const pct = useMemo(() => Math.max(0, Math.min(100, Math.round((value / max) * 100))), [value, max]);
  return (
    <div className="mt-3 h-2 w-full rounded-full bg-secondary">
      <div className="h-2 rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Countdown({ to }) {
  const targetRef = useRef(to);
  const [ms, setMs] = useState(Math.max(0, targetRef.current - Date.now()));
  useEffect(() => {
    targetRef.current = to;
    setMs(Math.max(0, targetRef.current - Date.now()));
  }, [to]);
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

function Testimonial({ name, initials, rating, date, children }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{name}</div>
              <div className="flex items-center gap-1 text-yellow-500" aria-label={`${rating} stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3 ${i < Number(rating || 0) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MenuItemsSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="w-full aspect-video bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MenuItemsError({ message }) {
  return <div className="text-sm text-destructive">{message}</div>;
}

function SectionSkeleton({ title }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="animate-pulse h-24 bg-muted rounded" />
      </CardContent>
    </Card>
  );
}

function SectionError({ title }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="text-sm text-destructive">Failed to load content.</div>
      </CardContent>
    </Card>
  );
}
