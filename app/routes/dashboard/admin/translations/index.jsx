import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  AlertCircle,
  FileText 
} from 'lucide-react';

export default function TranslationsIndex() {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    locale: '',
    namespace: '',
    search: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // Fetch translations
  const fetchTranslations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.locale) params.set('locale', filters.locale);
      if (filters.namespace) params.set('namespace', filters.namespace);
      if (filters.search) params.set('search', filters.search);
      params.set('page', filters.page);
      params.set('limit', filters.limit);

      const response = await fetch(`/api/translations/admin/translations?${params}`);
      const data = await response.json();

      if (data.success) {
        setTranslations(data.data.translations);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || 'Failed to fetch translations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this translation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/translations/admin/translations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        fetchTranslations();
      } else {
        setError(data.error || 'Failed to delete translation');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.locale) params.set('locale', filters.locale);
      if (filters.namespace) params.set('namespace', filters.namespace);
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
        setError(data.error || 'Failed to export translations');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.locale} 
              onValueChange={(value) => setFilters({ ...filters, locale: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locales</SelectItem>
                <SelectItem value="en">English (en)</SelectItem>
                <SelectItem value="es">Spanish (es)</SelectItem>
                <SelectItem value="fr">French (fr)</SelectItem>
                <SelectItem value="de">German (de)</SelectItem>
                <SelectItem value="it">Italian (it)</SelectItem>
                <SelectItem value="pt">Portuguese (pt)</SelectItem>
                <SelectItem value="ar">Arabic (ar)</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.namespace} 
              onValueChange={(value) => setFilters({ ...filters, namespace: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Namespaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Namespaces</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="menu">Menu</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="reservations">Reservations</SelectItem>
                <SelectItem value="ui">UI</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="validation">Validation</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({
                locale: '',
                namespace: '',
                search: '',
                page: 1,
                limit: 50
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Translations ({pagination.total})
          </CardTitle>
          <CardDescription>
            Showing {translations.length} of {pagination.total} translations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : translations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No translations found</p>
              <p className="text-sm">Try adjusting your filters or create a new translation</p>
            </div>
          ) : (
            <>
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
                  {translations.map((translation) => (
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
                          <Link to={`/dashboard/admin/translations/${translation.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/dashboard/admin/translations/${translation.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(translation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
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
  );
}
