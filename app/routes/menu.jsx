import { useLoaderData } from "react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('menu');
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");

  const displayedItems = useMemo(() => {
    const normalized = (s) => (s || "").toString().toLowerCase();
    let filtered = items.filter((it) => {
      if (!query) return true;
      const q = normalized(query);
      return normalized(it.name).includes(q) || normalized(it.description).includes(q);
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
  }, [items, query, sort]);

  return (
    <main className="container mx-auto p-6 grid gap-8">
      {/* Hero */}
      <section className="rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('hero.title')}</h1>
        <p className="text-muted-foreground mt-2 max-w-prose">{t('hero.subtitle')}</p>
      </section>

      {/* Categories & Controls */}
      <section className="grid gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">{t('categories')}</h2>
            <div className="flex flex-wrap gap-2">
              <a href={`/menu`}></a>
              {categories.map((c) => (
                <a key={c.id} href={`/menu?categoryId=${encodeURIComponent(c.id)}`}>
                  <Badge variant={activeCategoryId === c.id ? "default" : "outline"}>{c.name}</Badge>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('actions.searchPlaceholder')}
                className="max-w-sm"
              />
              <Button type="button" onClick={() => { /* no-op: input already filters */ }}>
                {t('actions.search')}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('actions.sortBy')}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="popular">{t('actions.sort.popular')}</option>
                <option value="priceLow">{t('actions.sort.priceLow')}</option>
                <option value="priceHigh">{t('actions.sort.priceHigh')}</option>
                <option value="newest">{t('actions.sort.newest')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Items grid */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.available === false && (
                    <Badge variant="outline">{t('actions.unavailable')}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                  <Button size="sm">{t('actions.add')}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {displayedItems.length === 0 && (
            <div className="col-span-full text-muted-foreground">{t('actions.noItems')}</div>
          )}
        </div>
      </section>
    </main>
  );
}