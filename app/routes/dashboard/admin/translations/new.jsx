import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Form, redirect } from 'react-router';

export const meta = () => [
  { title: 'New Translation - Cantina' }
];

export async function action({ request }) {
  const formData = await request.formData();
  const cookie = request.headers.get("cookie") || "";
  const url = new URL(request.url);
  
  const key = formData.get('key');
  const namespace = formData.get('namespace');
  const locale = formData.get('locale');
  const value = formData.get('value');
  const description = formData.get('description');
  
  try {
    const response = await fetch(`${url.origin}/api/translations/admin/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({ key, namespace, locale, value, description })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return redirect('/dashboard/admin/translations');
    } else {
      return { success: false, error: data.error || 'Failed to create translation' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default function NewTranslation({ actionData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    key: '',
    namespace: 'common',
    locale: 'en',
    value: '',
    description: ''
  });

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/admin/translations', { replace: true })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Translations
        </Button>
        <h1 className="text-3xl font-bold">Add New Translation</h1>
        <p className="text-muted-foreground">
          Create a new translation string
        </p>
      </div>

      {actionData?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionData.error}</AlertDescription>
        </Alert>
      )}

      <Form method="post">
        <Card>
          <CardHeader>
            <CardTitle>Translation Details</CardTitle>
            <CardDescription>Enter the translation information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                name="key"
                placeholder="e.g., hero.title or success"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground">
                Use dot notation for nested keys (e.g., hero.title)
              </p>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Textarea
                id="value"
                name="value"
                placeholder="Enter the translated text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Context for translators"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
              <p className="text-sm text-muted-foreground">
                Help translators understand the context
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard/admin/translations')}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Create Translation
          </Button>
        </div>
      </Form>
    </div>
  );
}
