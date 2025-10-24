import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, History, Save } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Form, redirect } from 'react-router';

export const meta = () => [
  { title: 'Edit Translation - Cantina' }
];

export async function loader({ params, request }) {
  const { id } = params;
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const response = await fetch(`${url.origin}/api/translations/admin/translations/${id}`, {
      headers: { cookie }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { translation: data.data.translation, error: null };
    } else {
      return { translation: null, error: data.error || 'Failed to fetch translation' };
    }
  } catch (error) {
    return { translation: null, error: error.message };
  }
}

export async function action({ request, params }) {
  const { id } = params;
  const formData = await request.formData();
  const cookie = request.headers.get("cookie") || "";
  const url = new URL(request.url);
  
  const value = formData.get('value');
  const description = formData.get('description');
  const isActive = formData.get('isActive') === 'true';
  const reason = formData.get('reason');
  
  try {
    const response = await fetch(`${url.origin}/api/translations/admin/translations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({ value, description, isActive, reason })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return redirect('/dashboard/admin/translations');
    } else {
      return { success: false, error: data.error || 'Failed to update translation' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default function EditTranslation({ loaderData, actionData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { translation, error: loaderError } = loaderData;
  
  const [formData, setFormData] = useState({
    value: translation?.value || '',
    description: translation?.description || '',
    isActive: translation?.isActive ?? true,
    reason: ''
  });

  if (!translation) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loaderError || 'Translation not found'}</AlertDescription>
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

      {(loaderError || actionData?.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loaderError || actionData?.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Form method="post">
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
                    name="value"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for change (optional)</Label>
                  <Input
                    id="reason"
                    name="reason"
                    placeholder="Why are you making this change?"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <input type="hidden" name="isActive" value={formData.isActive.toString()} />
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
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </Form>
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
