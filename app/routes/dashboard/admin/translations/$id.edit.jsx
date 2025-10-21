import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, History, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

export default function EditTranslation() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [translation, setTranslation] = useState(null);
  const [formData, setFormData] = useState({
    value: '',
    description: '',
    isActive: true,
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTranslation();
  }, [id]);

  const fetchTranslation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/translations/admin/translations/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setTranslation(data.data.translation);
        setFormData({
          value: data.data.translation.value,
          description: data.data.translation.description || '',
          isActive: data.data.translation.isActive,
          reason: ''
        });
      } else {
        setError(data.error || 'Failed to fetch translation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/translations/admin/translations/${id}`, {
        method: 'PUT',
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
        setError(data.error || 'Failed to update translation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!translation) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Translation not found</AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Edit Translation</h1>
        <p className="text-muted-foreground">
          Update translation for {translation.key}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Translation Details</CardTitle>
                <CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{translation.namespace}</Badge>
                    <Badge variant="secondary">{translation.locale}</Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key">Key (read-only)</Label>
                  <Input
                    id="key"
                    value={translation.key}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value *</Label>
                  <Textarea
                    id="value"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for change (optional)</Label>
                  <Input
                    id="reason"
                    placeholder="Why are you making this change?"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
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
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Change History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {translation.history && translation.history.length > 0 ? (
                <div className="space-y-4">
                  {translation.history.map((change, index) => (
                    <div key={change.id} className="pb-4 border-b last:border-0">
                      <div className="text-sm text-muted-foreground">
                        {new Date(change.changedAt).toLocaleString()}
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Old:</span> {change.oldValue}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">New:</span> {change.newValue}
                      </div>
                      {change.reason && (
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Reason:</span> {change.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No change history</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
