import { useLoaderData, Link, Await, ScrollRestoration } from "react-router";
import { Suspense, useEffect, useMemo, useRef, useState, lazy } from "react";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
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

export async function loader({ request, context }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const headers = { cookie };
  const urlLng = url.searchParams.get('lng');
  const cookieLng = (() => { try { return (cookie.match(/(?:^|; )i18next=([^;]+)/) || [])[1] && decodeURIComponent((cookie.match(/(?:^|; )i18next=([^;]+)/) || [])[1]); } catch { return null; } })();
  const lng = context?.lng || urlLng || cookieLng || 'en';



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
      const res = await fetch(`${url.origin}/api/cms/home?locale=${encodeURIComponent(lng)}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data?.data?.page?.data || {};
    } catch {
      // Return minimal defaults so UI doesn't skeleton forever
      // These will be translated by the t() function in the component
      return {
        hero: {
          badge: 'New',
          title: 'Authentic Mexican. <primary>Delivered fast.</primary>',
          desc: 'Order in seconds, reserve instantly, track live.'
        },
        cta: {
          limited: 'Limited-time offer',
          title: '🔥 FREE DELIVERY on $25+ Orders',
          desc: 'Order in seconds or reserve instantly.',
          socialProof: 'Join 2,847+ customers who saved today',
          start: 'Start an Order',
          reserve: 'Reserve Now'
        }
      };
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
  const safeCms = cms || {};

  return (
    <main className="space-y-0">
      <Suspense>
        <Await resolve={items}>{(resolved) => <JsonLd items={resolved} />}</Await>
      </Suspense>
      {/* Hero */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection safeCms={safeCms} t={t} i18n={i18n} />
      </Suspense>

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
      <Suspense fallback={<LogoCloudSkeleton />}>
        <LogoCloudSection cms={cms} t={t} />
      </Suspense>

      {/* Explore menu (Tabs) */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{cms?.explore?.heading ?? t('explore.heading')}</h2>
        <Tabs defaultValue="tacos" className="w-full">
          <TabsList>
            <TabsTrigger value="tacos">{cms?.explore?.tabs?.tacos ?? t('explore.tacos')}</TabsTrigger>
            <TabsTrigger value="bowls">{cms?.explore?.tabs?.bowls ?? t('explore.bowls')}</TabsTrigger>
            <TabsTrigger value="drinks">{cms?.explore?.tabs?.drinks ?? t('explore.drinks')}</TabsTrigger>
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
        <Suspense fallback={<SectionSkeleton title={t?.('home:offers.heading') || 'Seasonal offers'} />}> 
          <Await resolve={offers} errorElement={<SectionError title={t?.('home:offers.heading') || 'Seasonal offers'} />}> 
            {(resolvedOffers) => (
              <LazyOffers offers={resolvedOffers} t={t} cmsOffers={cms?.offers?.items || []} heading={cms?.offers?.heading} badge={cms?.offers?.badge} />
            )}
          </Await>
        </Suspense>
      </section>

      {/* Customer love (testimonials) lazy */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{cms?.testimonials?.heading ?? t('testimonials.heading')}</h2>
        <Suspense fallback={<SectionSkeleton title={t('testimonials.heading')} />}> 
          <Await resolve={testimonials} errorElement={<SectionError title={t('testimonials.heading')} />}> 
            {(resolvedTestimonials) => (
              <CarouselTestimonials testimonials={(cms?.testimonials?.items && cms.testimonials.items.length) ? cms.testimonials.items : resolvedTestimonials} />
            )}
          </Await>
        </Suspense>
      </section>

      {/* Sourcing & values */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight">{cms?.values?.heading ?? t('values.heading')}</h3>
            <p className="text-sm text-muted-foreground">{cms?.values?.desc ?? t('values.desc')}</p>
            <div className="flex flex-wrap gap-2">
              {(cms?.values?.badges || [t('values.badges.localProduce'), t('values.badges.sustainableSeafood'), t('values.badges.fairTrade'), t('values.badges.lowWaste')]).map((b) => (
                <Badge key={b} variant="secondary">{b}</Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(cms?.values?.cards || [
              { text: t('values.cards.dailyMarket') },
              { text: t('values.cards.houseSalsas') },
              { text: t('values.cards.localTortillas') },
              { text: t('values.cards.compostablePackaging') },
            ]).map((c, i) => (
              <Card key={i} className="overflow-hidden"><CardContent className="p-0"><div className="w-full aspect-video bg-muted border" /><div className="p-3 text-sm text-muted-foreground">{c.text}</div></CardContent></Card>
            ))}
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
          <h2 className="text-2xl font-semibold tracking-tight">{cms?.how?.heading ?? t('how.heading')}</h2>
          <p className="text-sm text-muted-foreground">{cms?.how?.desc ?? t('how.desc')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(cms?.how?.steps || [
            { title: t('how.step1.title'), desc: t('how.step1.desc') },
            { title: t('how.step2.title'), desc: t('how.step2.desc') },
            { title: t('how.step3.title'), desc: t('how.step3.desc') },
          ]).map((s, i) => (
            <Step key={i} number={i+1} title={s.title}>{s.desc}</Step>
          ))}
        </div>
      </section>

      {/* Popular this week */}
      <section className="container mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">{cms?.popular?.heading ?? t('popular.heading')}</h2>
          <Link className="text-sm underline" to="/menu" onClick={() => track('click_view_menu_popular')}>{cms?.popular?.seeMenu ?? t('popular.seeMenu')}</Link>
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
          {cms?.faq?.items ? (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">{cms?.faq?.heading || <span className="animate-pulse bg-muted h-8 w-48 rounded">Loading...</span>}</h2>
              <Accordion type="single" collapsible className="w-full">
                {cms.faq.items.map((q, i) => (
                  <AccordionItem key={i} value={`q${i}`}>
                    <AccordionTrigger>{q.q}</AccordionTrigger>
                    <AccordionContent>{q.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <LazyFAQ t={t} />
          )}
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
                  {t('cta.endsTonight')}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mt-1 tracking-tight">
                  {t('cta.title')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('cta.desc')}
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('cta.socialProof')}
                </div>
                <div className="text-xs text-primary mt-1" aria-live="polite">
                  {t('cta.limited')} · ⏰ <Countdown to={4 * 60 * 60 * 1000} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="px-6" onClick={() => track('click_start_cta')}>
                  {t('cta.start')}
                </Button>
                <Button variant="outline" className="px-6" onClick={() => track('click_reserve_cta')}>
                  {t('cta.reserve')}
                </Button>
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

function HeroSection({ safeCms, t, i18n }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 pt-16 pb-12 grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <Badge className="w-fit" variant="secondary">{safeCms.hero?.badge ?? t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {safeCms.hero?.title ? <span dangerouslySetInnerHTML={{ __html: safeCms.hero.title }} /> : <Trans i18nKey="hero.title" ns="home" components={{ primary: <span className="text-primary" /> }} />}
          </h1>
          <p className="text-muted-foreground max-w-prose">
            {safeCms.hero?.desc || t('hero.desc')}
          </p>
          <div className="flex items-center gap-3 text-sm" aria-live="polite">
            <Suspense fallback={null}>
              <Await resolve={import("../routes/home.jsx").then(mod => mod)}>{() => (
                <></>
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
              {safeCms.hero?.image?.avif ? <source srcSet={safeCms.hero.image.avif} type="image/avif" /> : null}
              {safeCms.hero?.image?.webp ? <source srcSet={safeCms.hero.image.webp} type="image/webp" /> : null}
              <img src={safeCms.hero?.image?.jpg || "/hero.jpg"} alt={safeCms.hero?.imageAlt || t('hero.imageAlt')} loading="eager" width="1200" height="900" className="w-full h-full object-cover" />
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
  )
}

function LogoCloudSection({ cms, t }) {
  return (
    <section className="container mx-auto px-6 py-8">
      <div className="text-center text-xs text-muted-foreground">{cms?.logo?.heading ?? t('logo.heading')}</div>
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-6 opacity-80">
        {(cms?.logo?.brands || ['FlavorMag','EatHub','CityEats','DineNow','LocalBest']).map((name) => (
          <div key={name} className="bg-secondary text-foreground/70 rounded-md py-3 text-center text-xs">{name}</div>
        ))}
      </div>
    </section>
  )
}

function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 pt-16 pb-12 grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="relative">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        </div>
      </div>
      <div className="mex-divider" />
    </section>
  )
}

function LogoCloudSkeleton() {
  return (
    <section className="container mx-auto px-6 py-8">
      <Skeleton className="h-3 w-32 mx-auto" />
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-6 opacity-80">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-md" />
        ))}
      </div>
    </section>
  )
}

function MenuItemCard({ item, t, locale }) {
  const { t: tMenu } = useTranslation('menu')
  const tags = [item.isVegetarian ? tMenu('filters.vegetarian') : null, item.isVegan ? tMenu('filters.vegan') : null].filter(Boolean)
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
  const { t: tMenu } = useTranslation('menu')
  const tags = [item.isVegetarian ? tMenu('filters.vegetarian') : null, item.isVegan ? tMenu('filters.vegan') : null].filter(Boolean)
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
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(true) // Default to mobile for SSR
  
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (!isMobile || !isMounted) return
    const id = setInterval(() => setIdx(i => (i + 1) % Math.max(testimonials.length, 1)), 4000)
    return () => clearInterval(id)
  }, [isMobile, testimonials?.length, isMounted])
  
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
                  <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
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
  const [ms, setMs] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Set initial countdown only after mounting to prevent hydration mismatch
    setMs(to);
  }, [to]);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const id = setInterval(() => setMs((prev) => Math.max(0, prev - 1000)), 1000);
    return () => clearInterval(id);
  }, [isMounted]);
  
  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return <span>--d --:--:--</span>;
  }
  
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
              <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
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