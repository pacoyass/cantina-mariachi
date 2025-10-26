import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, FileJson, Upload } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Form } from 'react-router';

export const meta = () => [
  { title: 'Import Translations - Cantina' }
];

export async function action({ request }) {
  const formData = await request.formData();
  const cookie = request.headers.get("cookie") || "";
  const url = new URL(request.url);
  
  const namespace = formData.get('namespace');
  const locale = formData.get('locale');
  const translations = formData.get('translations');
  const overwrite = formData.get('overwrite') === 'true';
  
  try {
    // Parse JSON to validate
    const translationsObj = JSON.parse(translations);
    
    const response = await fetch(`${url.origin}/api/translations/admin/translations/bulk-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({
        namespace,
        locale,
        translations: translationsObj,
        overwrite
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        stats: data.data.stats,
        message: `Import completed: ${data.data.stats.imported} imported, ${data.data.stats.updated} updated, ${data.data.stats.skipped} skipped`
      };
    } else {
      return { success: false, error: data.error || 'Failed to import translations' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default function ImportTranslations({ actionData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namespace: 'common',
    locale: 'en',
    translations: '',
    overwrite: false
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, translations: event.target?.result });
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/admin/translations')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Translations
        </Button>
        <h1 className="text-3xl font-bold">Import Translations</h1>
        <p className="text-muted-foreground">
          Upload JSON translations to the database
        </p>
      </div>

      {actionData?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionData.error}</AlertDescription>
        </Alert>
      )}

      {actionData?.success && (
        <Alert className="mb-6">
          <FileJson className="h-4 w-4" />
          <AlertDescription>
            {actionData.message}
          </AlertDescription>
        </Alert>
      )}

      <Form method="post" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Settings</CardTitle>
            <CardDescription>Configure the import parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namespace">Namespace *</Label>
                <input type="hidden" name="namespace" value={formData.namespace} />
                <Select 
                  value={formData.namespace}
                  onValueChange={(value) => setFormData({ ...formData, namespace: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Locale *</Label>
                <input type="hidden" name="locale" value={formData.locale} />
                <Select 
                  value={formData.locale}
                  onValueChange={(value) => setFormData({ ...formData, locale: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (en)</SelectItem>
                    <SelectItem value="es">Spanish (es)</SelectItem>
                    <SelectItem value="fr">French (fr)</SelectItem>
                    <SelectItem value="de">German (de)</SelectItem>
                    <SelectItem value="it">Italian (it)</SelectItem>
                    <SelectItem value="pt">Portuguese (pt)</SelectItem>
                    <SelectItem value="ar">Arabic (ar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="overwrite"
                checked={formData.overwrite}
                onCheckedChange={(checked) => setFormData({ ...formData, overwrite: checked })}
              />
              <input type="hidden" name="overwrite" value={formData.overwrite.toString()} />
              <Label htmlFor="overwrite">Overwrite existing translations</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation Data</CardTitle>
            <CardDescription>Upload a JSON file or paste the content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload JSON File</Label>
              <Input
                id="file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translations">Or paste JSON content *</Label>
              <Textarea
                id="translations"
                name="translations"
                value={formData.translations}
                onChange={(e) => setFormData({ ...formData, translations: e.target.value })}
                placeholder={`{
  "success": "Success",
  "error": "Error",
  "hero": {
    "title": "Welcome"
  }
}`}
                rows={12}
                className="font-mono text-sm"
                required
              />
              <p className="text-sm text-muted-foreground">
                Nested objects will be flattened (e.g., hero.title)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard/admin/translations')}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Upload className="mr-2 h-4 w-4" />
            Import Translations
          </Button>
        </div>
      </Form>
    </div>
  );
}
