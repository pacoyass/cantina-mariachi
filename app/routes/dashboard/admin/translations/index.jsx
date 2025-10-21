import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    Upload
  } from '@/lib/lucide-shim';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useFetcher, useNavigate } from 'react-router';

export const meta = () => [
  { title: 'Translations - Cantina' }
];

// Action for delete operations
export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const cookie = request.headers.get("cookie") || "";
  const url = new URL(request.url);
  
  if (intent === 'delete') {
    const id = formData.get('id');
    try {
      const response = await fetch(`${url.origin}/api/translations/admin/translations/${id}`, {
        method: 'DELETE',
        headers: { cookie },
        credentials: 'include'
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

export async function loader({ request, context }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const lang = context.lng;
  
  // Get query params for filtering
  const locale = url.searchParams.get('locale') || '';
  const namespace = url.searchParams.get('namespace') || '';
  const search = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '50';
  
  try {
    // Build API URL with query params
    const apiParams = new URLSearchParams();
    if (locale) apiParams.set('locale', locale);
    if (namespace) apiParams.set('namespace', namespace);
    if (search) apiParams.set('search', search);
    apiParams.set('page', page);
    apiParams.set('limit', limit);
    
    // Fetch translations and metadata in parallel
    const [translationsResponse, metadataResponse] = await Promise.all([
      fetch(`${url.origin}/api/translations/admin/translations?${apiParams}`, { 
        headers: { cookie } 
      }),
      fetch(`${url.origin}/api/translations/admin/translations/metadata`, { 
        headers: { cookie } 
      })
    ]);
    
    if (!translationsResponse.ok) {
      throw new Error('Failed to fetch translations');
    }
    
    const data = await translationsResponse.json();
    const metadata = metadataResponse.ok ? await metadataResponse.json() : { data: { locales: [], namespaces: [] } };
    
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


export default function TranslationsIndexPage({ loaderData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { data, metadata, error, filters: initialFilters } = loaderData;
  const { translations, pagination } = data;
  const { locales = [], namespaces = [] } = metadata || {};
  
  // Local state for search input (instant typing)
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  
  // Sync searchInput when URL changes (e.g., clear filters button)
  useEffect(() => {
    setSearchInput(initialFilters.search || '');
  }, [initialFilters.search]);
  
  // Debounce search: Update URL after user stops typing
  useEffect(() => {
    // Don't trigger on initial render or if search hasn't changed
    if (searchInput === initialFilters.search) {
      return;
    }
    
    const timer = setTimeout(() => {
      updateFilters({ ...initialFilters, search: searchInput, page: 1 });
    }, 500); // Wait 500ms after user stops typing
    
    return () => clearTimeout(timer);
  }, [searchInput, initialFilters.search]); // Only depend on search values
  
  // Update filters by navigating with new query params
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.locale) params.set('locale', newFilters.locale);
    if (newFilters.namespace) params.set('namespace', newFilters.namespace);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.page && newFilters.page !== 1) params.set('page', newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 50) params.set('limit', newFilters.limit.toString());
    
    navigate(`/dashboard/admin/translations?${params.toString()}`, { replace: true });
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this translation?')) {
      return;
    }
    
    // Use fetcher to submit delete action
    fetcher.submit(
      { intent: 'delete', id },
      { method: 'post' }
    );
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (initialFilters.locale) params.set('locale', initialFilters.locale);
      if (initialFilters.namespace) params.set('namespace', initialFilters.namespace);
      params.set('format', 'nested');

      const response = await fetch(`/api/translations/admin/translations/bulk-export?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        console.error('Export failed:', data.error);
        alert('Failed to export translations: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export translations: ' + err.message);
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Translations</h1>
          <p className="text-muted-foreground">
            Manage translation strings for all languages
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
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

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter translations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search key or value..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={initialFilters.locale} 
              onValueChange={(value) => updateFilters({ ...initialFilters, locale: value, page: 1 })}
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

            <Select 
              value={initialFilters.namespace} 
              onValueChange={(value) => updateFilters({ ...initialFilters, namespace: value, page: 1 })}
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

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchInput('');
                updateFilters({
                  locale: '',
                  namespace: '',
                  search: '',
                  page: 1,
                  limit: 50
                });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Translations ({pagination.total || 0})
          </CardTitle>
          <CardDescription>
            Showing {translations.length || 0} of {pagination.total || 0} translations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {translations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No translations found</p>
              <p className="text-sm">Try adjusting your filters or create a new translation</p>
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
                    {translations?.map((translation) => (
                      <TableRow key={translation.id}>
                        <TableCell className="font-mono text-sm">
                          {translation.key}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{translation.namespace}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{translation.locale}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {translation.value}
                        </TableCell>
                        <TableCell>
                          {translation.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link to={`/dashboard/admin/translations/${translation.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" sideOffset={10}>
                                <p>View</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link to={`/dashboard/admin/translations/${translation.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" sideOffset={10}>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(translation.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" sideOffset={10}>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => updateFilters({ ...initialFilters, page: pagination.page - 1 })}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => updateFilters({ ...initialFilters, page: pagination.page + 1 })}
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
