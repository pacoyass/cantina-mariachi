import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';

export default function NewTranslation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    key: '',
    namespace: 'common',
    locale: 'en',
    value: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translations/admin/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        navigate('/dashboard/admin/translations');
      } else {
        setError(data.error || 'Failed to create translation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/admin/translations')}
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Creating...' : 'Create Translation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
