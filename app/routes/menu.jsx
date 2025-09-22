import { useLoaderData, Link } from "react-router";
import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { LayoutGrid, List, ChevronDown, Star } from "../lib/lucide-shim.js";

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

  const lng = request?.language || 'en';
  const [catRes, itemsRes, cmsRes] = await Promise.all([
    fetch(`${url.origin}/api/menu/categories`, { headers: { cookie } }),
    fetch(`${url.origin}/api/menu/items${categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : ""}`, { headers: { cookie } }),
    fetch(`${url.origin}/api/cms/menu?locale=${encodeURIComponent(lng)}`, { headers: { cookie } }),
  ]);
  const cats = await jsonOrNull(catRes);
  const items = await jsonOrNull(itemsRes);
  const cmsJson = await jsonOrNull(cmsRes);

  return {
    categories: cats?.data?.categories ?? [],
    items: items?.data?.items ?? [],
    activeCategoryId: categoryId,
    cms: cmsJson?.data?.page?.data || {},
  };
}

function isNew(createdAt) {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return days <= 14;
}

export default function MenuPage() {
  const { categories, items, activeCategoryId, cms } = useLoaderData();
  const { t } = useTranslation('menu');
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState("grid");
  const [filters, setFilters] = useState({ vegetarian: false, vegan: false, glutenFree: false, spicy: false });
  const searchRef = useRef(null);

  const displayedItems = useMemo(() => {
    const normalized = (s) => (s || "").toString().toLowerCase();
    let filtered = items.filter((it) => {
      if (query) {
        const q = normalized(query);
        if (!normalized(it.name).includes(q) && !normalized(it.description).includes(q)) return false;
      }
      const tags = (it.tags || []).map((x) => normalized(x));
      if (filters.vegetarian && !tags.includes('vegetarian')) return false;
      if (filters.vegan && !tags.includes('vegan')) return false;
      if (filters.glutenFree && !tags.includes('gluten-free') && !tags.includes('glutenfree')) return false;
      if (filters.spicy && !tags.includes('spicy')) return false;
      return true;
    });

    if (sort === 'priceLow') {
      filtered = [...filtered].sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sort === 'priceHigh') {
      filtered = [...filtered].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    } else if (sort === 'newest') {
      const getTime = (it) => new Date(it.createdAt || it.updatedAt || 0).getTime();
      filtered = [...filtered].sort((a, b) => getTime(b) - getTime(a));
    } else if (sort === 'popular') {
      const score = (it) => Number(it.orderCount ?? it.popularity ?? 0);
      filtered = [...filtered].sort((a, b) => score(b) - score(a));
    }
    return filtered;
  }, [items, query, sort, filters]);

  const resultsCount = displayedItems.length;

  return (
    <main className="container mx-auto p-6 grid gap-8">
      {/* Hero */}
      <section className="rounded-xl border bg-card p-8 shadow-sm relative overflow-hidden">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{cms?.hero?.title || t('hero.title')}</h1>
            <p className="text-muted-foreground max-w-prose">{cms?.hero?.subtitle || t('hero.subtitle')}</p>
            <div className="flex flex-wrap gap-2">
              <Button className="px-6" onClick={() => { try { searchRef.current?.focus(); } catch {} }}>{t('nav.orderNow', { ns: 'ui' })}</Button>
              <a href="#menu-items" className="px-6 inline-flex items-center justify-center rounded-md border bg-secondary text-secondary-foreground text-sm font-medium">
                {cms?.hero?.browseMenu || t('hero.browseMenu', { ns: 'home' })}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="secondary">{categories.length} {cms?.categories?.label || t('categories')}</Badge>
              <Badge variant="secondary">{t('results', { count: resultsCount })}</Badge>
            </div>
          </div>
          <div className="relative">
            {(() => {
              const score = (it) => Number(it.orderCount ?? it.popularity ?? 0);
              const featured = [...items].sort((a, b) => score(b) - score(a))[0];
              if (!featured) return null;
              return (
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span>{featured.name}</span>
                      <Badge variant="secondary">{cms?.badges?.popular || t('badges.popular')}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="rounded-md overflow-hidden border bg-muted">
                        {featured.imageUrl ? (
                          <img src={featured.imageUrl} alt={featured.name} className="w-full h-full object-cover aspect-video" />
                        ) : (
                          <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{featured.description}</p>
                      <div className="text-sm font-medium">${Number(featured.price).toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Categories & Controls */}
      <section className="grid gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1 w-full">
            <h2 className="text-xl font-semibold tracking-tight">{cms?.categories?.heading || t('categories')}</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Link to={`/menu`}>
                <Badge variant={!activeCategoryId ? "default" : "outline"}>{cms?.categories?.all || t('categoriesAll', { defaultValue: 'All' })}</Badge>
              </Link>
              {categories.map((c) => (
                <Link key={c.id} to={`/menu?categoryId=${encodeURIComponent(c.id)}`}>
                  <Badge variant={activeCategoryId === c.id ? "default" : "outline"}>{c.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('actions.searchPlaceholder')}
                className="max-w-sm"
                ref={searchRef}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <span className="mr-2 text-sm text-muted-foreground">{t('actions.sortBy')}</span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSort('popular')}>{t('actions.sort.popular')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort('priceLow')}>{t('actions.sort.priceLow')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort('priceHigh')}>{t('actions.sort.priceHigh')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort('newest')}>{t('actions.sort.newest')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="ml-auto flex items-center gap-1 rounded-md border p-1">
                <Button size="icon" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} aria-pressed={view==='grid'}>
                  <LayoutGrid className="size-4" />
                </Button>
                <Button size="icon" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} aria-pressed={view==='list'}>
                  <List className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{cms?.filters?.heading || t('filters.dietary')}</span>
              <FilterChip active={filters.vegetarian} onClick={() => setFilters((f) => ({ ...f, vegetarian: !f.vegetarian }))}>{cms?.filters?.vegetarian || t('filters.vegetarian')}</FilterChip>
              <FilterChip active={filters.vegan} onClick={() => setFilters((f) => ({ ...f, vegan: !f.vegan }))}>{cms?.filters?.vegan || t('filters.vegan')}</FilterChip>
              <FilterChip active={filters.glutenFree} onClick={() => setFilters((f) => ({ ...f, glutenFree: !f.glutenFree }))}>{cms?.filters?.glutenFree || t('filters.glutenFree')}</FilterChip>
              <FilterChip active={filters.spicy} onClick={() => setFilters((f) => ({ ...f, spicy: !f.spicy }))}>{cms?.filters?.spicy || t('filters.spicy')}</FilterChip>
              <span className="ml-auto text-xs text-muted-foreground">{t('results', { count: resultsCount, defaultValue: `Showing ${resultsCount} items` })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Items */}
      <section id="menu-items">
        <div className={`grid gap-4 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {displayedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <div className="flex gap-1">
                      {isNew(item.createdAt) && <Badge variant="secondary">{t('badges.new')}</Badge>}
                      {Number(item.orderCount ?? item.popularity ?? 0) > 50 && <Badge variant="secondary">{t('badges.popular')}</Badge>}
                    </div>
                  </CardTitle>
                  {item.available === false && (
                    <Badge variant="outline">{t('actions.unavailable')}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`grid ${view === 'list' ? 'grid-cols-[160px_1fr]' : 'grid-cols-1'} gap-3`}>
                  <div className="rounded-md overflow-hidden border bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover aspect-video" />
                    ) : (
                      <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" />)
                    }
                  </div>
                  <div>
                    {item.rating ? (
                      <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span>{Number(item.rating).toFixed(1)}</span>
                      </div>
                    ) : null}
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                      <Button size="sm">{t('actions.add')}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {displayedItems.length === 0 && (
            <div className="col-span-full text-muted-foreground">{cms?.actions?.noItems || t('actions.noItems')}</div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={active ? 'default' : 'outline'}
      className="h-8 px-3 text-xs"
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}