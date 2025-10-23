// app/routes/dashboard/admin/translations.jsx
import { TranslationsDataTable } from '@/components/admin/translations-data-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';

import
  {
    AlertCircle,
    Download, FileText,
    Plus,
    Search, Upload,
    X
  } from "@/lib/lucide-shim";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useFetcher, useLoaderData, isRouteErrorResponse, useRouteError } from "react-router";

// Meta
export const meta = () => [{ title: 'Translations - Cantina' }];

// --- ACTION (delete/export) ---
export async function action({ request, context }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  const { csrfToken } = context || {};
  const userAgent = request.headers.get("user-agent");

  if (intent === 'delete') {
    const id = formData.get('id');
    try {
      const response = await fetch(`${url.origin}/api/translations/admin/translations/${id}`, {
        method: 'DELETE',
        signal: request.signal,
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

  if (intent === 'export') {
    const format = formData.get('format') || 'json';
    const locale = formData.get('locale') || '';
    const namespace = formData.get('namespace') || '';
    const search = formData.get('search') || '';
    
    try {
      const apiParams = new URLSearchParams();
      if (locale) apiParams.set('locale', locale);
      if (namespace) apiParams.set('namespace', namespace);
      if (search) apiParams.set('search', search);
      apiParams.set('format', format);
      apiParams.set('limit', '10000'); // Export all matching records

      const response = await fetch(`${url.origin}/api/translations/admin/translations/export?${apiParams}`, {
        method: 'GET',
        signal: request.signal,
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': csrfToken,
          cookie: cookie,
          "User-Agent": userAgent || "unknown",
        },
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        return new Response(blob, {
          headers: {
            'Content-Type': format === 'csv' ? 'text/csv' : 'application/json',
            'Content-Disposition': `attachment; filename="translations-${Date.now()}.${format}"`,
          },
        });
      } else {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to export translations' };
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
  const sortBy = url.searchParams.get('sortBy') || '';
  const sortOrder = url.searchParams.get('sortOrder') || 'asc';
  const { csrfToken } = context || {};
  
  try {
    const apiParams = new URLSearchParams();
    if (locale) apiParams.set('locale', locale);
    if (namespace) apiParams.set('namespace', namespace);
    if (search) apiParams.set('search', search);
    if (sortBy) apiParams.set('sortBy', sortBy);
    if (sortOrder) apiParams.set('sortOrder', sortOrder);
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
      filters: { locale, namespace, search, page, limit, sortBy, sortOrder }
    };
  } catch (error) {
    console.error('Translations loader error:', error);
    return {
      data: { translations: [], pagination: { page: 1, total: 0, totalPages: 0 } },
      metadata: { locales: [], namespaces: [] },
      error: error.message,
      filters: { locale, namespace, search, page, limit, sortBy, sortOrder }
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
  const [loadingButton, setLoadingButton] = useState(null); // "next" | "prev" | null

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // keep local search input synced when data changes
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Reset when fetcher finishes
  useEffect(() => {
    if (fetcher.state === "idle") {
      setLoadingButton(null);
    }
  }, [fetcher.state]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu]);
  // --- Render ---
  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('translations.title', 'Translations')}</h1>
            <p className="text-muted-foreground">
              {t('translations.subtitle', 'Manage translation strings for all languages')}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative" ref={exportMenuRef}>
              <Button 
                variant="outline"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="mr-2 h-4 w-4" />
                {t('translations.export', 'Export')}
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border z-50">
                  <div className="py-1">
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="export" />
                      <input type="hidden" name="locale" value={filters.locale} />
                      <input type="hidden" name="namespace" value={filters.namespace} />
                      <input type="hidden" name="search" value={filters.search} />
                      <button
                        type="submit"
                        name="format"
                        value="json"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowExportMenu(false)}
                      >
                        {t('translations.exportJSON', 'Export as JSON')}
                      </button>
                      <button
                        type="submit"
                        name="format"
                        value="csv"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowExportMenu(false)}
                      >
                        {t('translations.exportCSV', 'Export as CSV')}
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
              )}
            </div>
            <Link to="/dashboard/admin/translations/import">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                {t('translations.import', 'Import')}
              </Button>
            </Link>
            <Link to="/dashboard/admin/translations/missing">
              <Button variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                {t('translations.findMissing', 'Find Missing')}
              </Button>
            </Link>
            <Link to="/dashboard/admin/translations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('translations.addNew', 'Add Translation')}
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
            <CardTitle>{t('translations.filters', 'Filters')}</CardTitle>
            <CardDescription>{t('translations.filtersDesc', 'Search and filter translations')}</CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form
              id="filters-form"
              method="get"
              action="/dashboard/admin/translations"
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Hidden inputs for sorting */}
              <input type="hidden" name="sortBy" value={filters.sortBy || ''} />
              <input type="hidden" name="sortOrder" value={filters.sortOrder || 'asc'} />
              
              {/* Search */}
              <div className="relative focus:text-muted-foreground text-foreground">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
                <Input
                  name="search"
                  placeholder={t('translations.searchPlaceholder', 'Search key or value...')}
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
                
                  <SelectTrigger   className="bg-transparent text-muted-foreground hover:text-foreground">
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
                {t('translations.clearFilters', 'Clear Filters')}
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>

        {/* --- Table --- */}
        <Card>
          <CardHeader>
            <CardTitle>{t('translations.tableTitle', 'Translations')} ({pagination.total || 0})</CardTitle>
            <CardDescription>
              {t('translations.showing', 'Showing {{count}} of {{total}} translations', { count: translations.length || 0, total: pagination.total || 0 })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {translations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>{t('translations.noResults', 'No translations found')}</p>
                <p className="text-sm">
                  {t('translations.noResultsHint', 'Try adjusting your filters or create a new translation')}
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="h-[calc(100vh-400px)] w-full">
                  <TranslationsDataTable 
                    data={translations} 
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={(columnId, order) => {
                      const form = document.getElementById("filters-form");
                      const formData = new FormData(form);
                      formData.set("sortBy", columnId);
                      formData.set("sortOrder", order);
                      fetcher.submit(formData, { method: "get" });
                    }}
                  />
                </ScrollArea>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t w-full gap-4">
    <div className="text-sm text-muted-foreground order-2 sm:order-1">
      Page {pagination.page} of {pagination.totalPages}
    </div>

    <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === 1 || loadingButton === "prev"}
        onClick={() => {
          setLoadingButton("prev");
          const form = document.getElementById("filters-form");
          const formData = new FormData(form);
          formData.set("page", pagination.page - 1);
          fetcher.submit(formData, { method: "get" });
        }}
        className="relative min-w-[80px] justify-center"
      >
        {loadingButton === "prev" && fetcher.state === "loading" ? (
        <div className='flex items-center justify-center gap-2'>
       
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
         <span>Loading</span>
      </div>
        ) : (
          "Previous"
        )}
      </Button>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === pagination.totalPages || loadingButton === "next"}
        onClick={() => {
          setLoadingButton("next");
          const form = document.getElementById("filters-form");
          const formData = new FormData(form);
          formData.set("page", pagination.page + 1);
          fetcher.submit(formData, { method: "get" });
        }}
        className="relative min-w-[80px] justify-center"
      >
        {loadingButton === "next" && fetcher.state === "loading" ? (
          <div className='flex items-center justify-center gap-2'>
           
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
             <span>Loading</span>
          </div>
        ) : (
          "Next"
        )}
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

// --- ERROR BOUNDARY ---
export function ErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <h2 className="text-lg font-semibold mb-2">
              {error.status} {error.statusText}
            </h2>
            <p>{error.data?.message || t('translations.errorOccurred', 'An error occurred')}</p>
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link to="/dashboard/admin/translations">
            <Button variant="outline">
              {t('translations.backToTranslations', 'Back to Translations')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <h2 className="text-lg font-semibold mb-2">
            {t('translations.unexpectedError', 'Unexpected Error')}
          </h2>
          <p className="mb-2">{error?.message || t('translations.somethingWentWrong', 'Something went wrong')}</p>
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          )}
        </AlertDescription>
      </Alert>
      <div className="mt-4">
        <Link to="/dashboard/admin/translations">
          <Button variant="outline">
            {t('translations.backToTranslations', 'Back to Translations')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
