// app/routes/dashboard/admin/translations/new.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, Save } from '@/lib/lucide-shim';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Form, redirect, Link, useActionData, useLoaderData, useNavigation, isRouteErrorResponse, useRouteError } from 'react-router';

export const meta = () => [
  { title: 'New Translation - Cantina' }
];

// --- ACTION (create) ---
export async function action({ request, context }) {
  const formData = await request.formData();
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  const { csrfToken } = context || {};
  const userAgent = request.headers.get("user-agent");
  
  const key = formData.get('key');
  const namespace = formData.get('namespace');
  const locale = formData.get('locale');
  const value = formData.get('value');
  const description = formData.get('description');
  
  try {
    const response = await fetch(`${url.origin}/api/translations/admin/translations`, {
      method: 'POST',
      signal: request.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        cookie: cookie,
        "User-Agent": userAgent || "unknown",
      },
      credentials: 'include',
      body: JSON.stringify({ key, namespace, locale, value, description })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return redirect('/dashboard/admin/translations?created=true');
    } else {
      // Handle both string and object errors
      const errorMessage = typeof data.error === 'string' 
        ? data.error 
        : data.error?.message || data.message || 'Failed to create translation';
      
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

// --- LOADER (fetch metadata) ---
export async function loader({ request, context }) {
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  const userAgent = request.headers.get("user-agent");
  const { csrfToken } = context || {};
  
  try {
    const response = await fetch(`${url.origin}/api/translations/admin/translations/metadata`, {
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

    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const metadata = await response.json();

    return {
      metadata: metadata.data || { locales: [], namespaces: [] },
      error: null
    };
  } catch (error) {
    console.error('Metadata loader error:', error);
    return {
      metadata: { locales: [], namespaces: [] },
      error: error.message
    };
  }
}

// --- COMPONENT ---
export default function NewTranslation() {
  const { t } = useTranslation();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  
  const { metadata } = loaderData;
  const { locales = [], namespaces = [] } = metadata || {};
  
  const isSubmitting = navigation.state === 'submitting';
  
  // Controlled state for Select components
  const [selectedNamespace, setSelectedNamespace] = useState('common');
  const [selectedLocale, setSelectedLocale] = useState('en');

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Link to="/dashboard/admin/translations">
          <Button 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('translations.backToTranslations', 'Back to Translations')}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {t('translations.newTranslation.title', 'Add New Translation')}
        </h1>
        <p className="text-muted-foreground">
          {t('translations.newTranslation.subtitle', 'Create a new translation string')}
        </p>
      </div>

      {actionData?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {typeof actionData.error === 'string' 
              ? actionData.error 
              : actionData.error?.message || JSON.stringify(actionData.error)}
          </AlertDescription>
        </Alert>
      )}

      {loaderData?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {typeof loaderData.error === 'string' 
              ? loaderData.error 
              : loaderData.error?.message || JSON.stringify(loaderData.error)}
          </AlertDescription>
        </Alert>
      )}

      <Form method="post">
        <Card>
          <CardHeader>
            <CardTitle>
              {t('translations.newTranslation.details', 'Translation Details')}
            </CardTitle>
            <CardDescription>
              {t('translations.newTranslation.detailsDesc', 'Enter the translation information')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key */}
            <div className="space-y-2">
              <Label htmlFor="key">
                {t('translations.newTranslation.keyLabel', 'Key')} *
              </Label>
              <Input
                id="key"
                name="key"
                placeholder={t('translations.newTranslation.keyPlaceholder', 'e.g., hero.title or success')}
                required
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                {t('translations.newTranslation.keyHint', 'Use dot notation for nested keys (e.g., hero.title)')}
              </p>
            </div>

            {/* Namespace & Locale */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namespace">
                  {t('translations.newTranslation.namespaceLabel', 'Namespace')} *
                </Label>
                <input type="hidden" name="namespace" value={selectedNamespace} />
                <Select 
                  value={selectedNamespace} 
                  onValueChange={setSelectedNamespace}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {namespaces.length > 0 ? (
                      namespaces.map((ns) => (
                        <SelectItem key={ns} value={ns}>
                          {ns.charAt(0).toUpperCase() + ns.slice(1)}
                        </SelectItem>
                      ))
                    ) : (
                      <>
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
                        <SelectItem value="translations">Translations</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">
                  {t('translations.newTranslation.localeLabel', 'Locale')} *
                </Label>
                <input type="hidden" name="locale" value={selectedLocale} />
                <Select 
                  value={selectedLocale}
                  onValueChange={setSelectedLocale}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.length > 0 ? (
                      locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {locale.toUpperCase()}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="en">English (en)</SelectItem>
                        <SelectItem value="es">Spanish (es)</SelectItem>
                        <SelectItem value="fr">French (fr)</SelectItem>
                        <SelectItem value="de">German (de)</SelectItem>
                        <SelectItem value="it">Italian (it)</SelectItem>
                        <SelectItem value="pt">Portuguese (pt)</SelectItem>
                        <SelectItem value="ar">Arabic (ar)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor="value">
                {t('translations.newTranslation.valueLabel', 'Value')} *
              </Label>
              <Textarea
                id="value"
                name="value"
                placeholder={t('translations.newTranslation.valuePlaceholder', 'Enter the translated text')}
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {t('translations.newTranslation.descriptionLabel', 'Description (optional)')}
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('translations.newTranslation.descriptionPlaceholder', 'Context for translators')}
                rows={2}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                {t('translations.newTranslation.descriptionHint', 'Help translators understand the context')}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/dashboard/admin/translations">
            <Button 
              type="button" 
              variant="outline"
              disabled={isSubmitting}
            >
              {t('translations.newTranslation.cancel', 'Cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('translations.newTranslation.creating', 'Creating...')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('translations.newTranslation.create', 'Create Translation')}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// --- ERROR BOUNDARY ---
export function ErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
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
    <div className="container mx-auto p-6 max-w-2xl">
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
