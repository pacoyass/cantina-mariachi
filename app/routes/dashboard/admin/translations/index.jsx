// app/routes/dashboard/admin/translations.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';

import
  {
    AlertCircle,
    Download,
    Edit,
    Eye,
    FileText,
    Plus,
    Search,
    Trash2,
    Upload,
    X,
  } from "@/lib/lucide-shim";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useFetcher, useLoaderData } from "react-router";

// Meta
export const meta = () => [{ title: 'Translations - Cantina' }];

// --- ACTION (delete) ---
export async function action({ request ,context}) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const url = new URL(request.url);
  const cookie = url.headers.get('cookie') || '';
  const { csrfToken } = context || {};
  const userAgent = url.headers.get("user-agent");

  if (intent === 'delete') {
    const id = formData.get('id');
    try {
      const response = await fetch(`${url.origin}/api/translations/admin/translations/${id}`, {
        method: 'DELETE',
        signal: url.signal,
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': csrfToken,
          cookie: cookie,
          "User-Agent": userAgent || "unknown",
        },
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        return { success: true, message: 'Translation deleted successfully' };
      } else {
        return { success: false, error: data.error || 'Failed to delete translation' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, error: 'Invalid action' };
}

// --- LOADER (fetch data) ---
export async function loader({ request, context }) {
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  const userAgent = request.headers.get("user-agent");

  const locale = url.searchParams.get('locale') || '';
  const namespace = url.searchParams.get('namespace') || '';
  const search = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '50';
  const { csrfToken } = context || {};
  
  try {
    const apiParams = new URLSearchParams();
    if (locale) apiParams.set('locale', locale);
    if (namespace) apiParams.set('namespace', namespace);
    if (search) apiParams.set('search', search);
    apiParams.set('page', page);
    apiParams.set('limit', limit);

    const [translationsResponse, metadataResponse] = await Promise.all([
      fetch(`${url.origin}/api/translations/admin/translations?${apiParams}`, {
        method: 'GET',
        signal: request.signal,
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': csrfToken,
          cookie: cookie,
          "User-Agent": userAgent || "unknown",
        },
        credentials: 'include',
      }),
      fetch(`${url.origin}/api/translations/admin/translations/metadata`, {
        method: 'GET',
        signal: request.signal,
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': csrfToken,
          cookie: cookie,
          "User-Agent": userAgent || "unknown",
        },
        credentials: 'include',
      })
    ]);

    if (!translationsResponse.ok) {
      throw new Error('Failed to fetch translations');
    }

    const data = await translationsResponse.json();
    const metadata = metadataResponse.ok
      ? await metadataResponse.json()
      : { data: { locales: [], namespaces: [] } };

    return {
      data: data.data || { translations: [], pagination: { page: 1, total: 0, totalPages: 0 } },
      metadata: metadata.data || { locales: [], namespaces: [] },
      error: null,
      filters: { locale, namespace, search, page, limit }
    };
  } catch (error) {
    console.error('Translations loader error:', error);
    return {
      data: { translations: [], pagination: { page: 1, total: 0, totalPages: 0 } },
      metadata: { locales: [], namespaces: [] },
      error: error.message,
      filters: { locale, namespace, search, page, limit }
    };
  }
}

// --- COMPONENT ---
export default function TranslationsIndexPage() {
  const { t } = useTranslation();
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const debounceRef = useRef(null);

  const activeData = fetcher.data ?? loaderData;
  const { data, metadata, error, filters } = activeData;
  const { translations, pagination } = data;
  const { locales = [], namespaces = [] } = metadata || {};

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);

  // keep local search input synced when data changes
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // --- Render ---
  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Translations</h1>
            <p className="text-muted-foreground">
              Manage translation strings for all languages
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link to="/dashboard/admin/translations/import">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </Link>
            <Link to="/dashboard/admin/translations/missing">
              <Button variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Find Missing
              </Button>
            </Link>
            <Link to="/dashboard/admin/translations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Translation
              </Button>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {(error || fetcher.data?.error) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || fetcher.data?.error}</AlertDescription>
          </Alert>
        )}
        {fetcher.data?.success && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fetcher.data.message}</AlertDescription>
          </Alert>
        )}

        {/* --- Filters + Search --- */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter translations</CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form
              id="filters-form"
              method="get"
              action="/dashboard/admin/translations"
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search key or value..."
                  value={searchInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInput(value);
                    setIsSearching(true); // Mark as searching
                    clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => {
                      const form = document.getElementById("filters-form");
                      const formData = new FormData(form);
                      formData.set("search", value);
                      fetcher.submit(formData, { method: "get" });
                      setIsSearching(false); // Done searching
                    }, 500);
                  }}
                  className="pl-10 pr-10"
                />

                {/* Spinner - only show when searching */}
                {fetcher.state === "loading" && isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}

                {/* Clear Button */}
                {searchInput.length > 0 && !isSearching && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setIsSearching(false);
                      const form = document.getElementById("filters-form");
                      const formData = new FormData(form);
                      formData.delete("search"); // ✅ Remove search param
                      fetcher.submit(formData, { method: "get" });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Locale */}
              <div>
                <input type="hidden" name="locale" value={filters.locale} />
                <Select
                  value={filters.locale}
                  onValueChange={(value) => {
                    const form = document.getElementById("filters-form");
                    const formData = new FormData(form);
                    formData.set("locale", value);
                    formData.set("page", "1"); // Reset to page 1 on filter change
                    fetcher.submit(formData, { method: "get" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Locales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locales</SelectItem>
                    {locales.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {locale.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Namespace */}
              <div>
                <input type="hidden" name="namespace" value={filters.namespace} />
                <Select
                  value={filters.namespace}
                  onValueChange={(value) => {
                    const form = document.getElementById("filters-form");
                    const formData = new FormData(form);
                    formData.set("namespace", value);
                    formData.set("page", "1"); // Reset to page 1 on filter change
                    fetcher.submit(formData, { method: "get" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Namespaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Namespaces</SelectItem>
                    {namespaces.map((ns) => (
                      <SelectItem key={ns} value={ns}>
                        {ns.charAt(0).toUpperCase() + ns.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setSearchInput("");
                  const form = document.getElementById("filters-form");
                  form.reset();
                  fetcher.submit(form, { method: "get" });
                }}
              >
                Clear Filters
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>

        {/* --- Table --- */}
        <Card>
          <CardHeader>
            <CardTitle>Translations ({pagination.total || 0})</CardTitle>
            <CardDescription>
              Showing {translations.length || 0} of {pagination.total || 0} translations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {translations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No translations found</p>
                <p className="text-sm">
                  Try adjusting your filters or create a new translation
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Namespace</TableHead>
                        <TableHead>Locale</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {translations.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-sm">{t.key}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{t.namespace}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{t.locale}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">{t.value}</TableCell>
                          <TableCell>
                            {t.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/dashboard/admin/translations/${t.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/dashboard/admin/translations/${t.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  fetcher.submit(
                                    { intent: "delete", id: t.id },
                                    { method: "post" }
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1 || fetcher.state === "loading"}
                        onClick={() => {
                          const form = document.getElementById("filters-form");
                          const formData = new FormData(form);
                          formData.set("page", pagination.page - 1);
                          fetcher.submit(formData, { method: "get" });
                        }}
                      >
                        Previous
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === pagination.totalPages || fetcher.state === "loading"}
                        onClick={() => {
                          const form = document.getElementById("filters-form");
                          const formData = new FormData(form);
                          formData.set("page", pagination.page + 1);
                          fetcher.submit(formData, { method: "get" });
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
