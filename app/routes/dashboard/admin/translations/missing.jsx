import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Download, FileWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const meta = () => [
  { title: 'Missing Translations - Cantina' }
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const response = await fetch(`${url.origin}/api/translations/admin/translations/missing`, {
      headers: { cookie }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { missing: data.data.missing || [], error: null };
    } else {
      return { missing: [], error: data.error || 'Failed to fetch missing translations' };
    }
  } catch (error) {
    return { missing: [], error: error.message };
  }
}

export default function MissingTranslations({ loaderData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { missing, error } = loaderData;

  const exportMissing = () => {
    const exportData = {};
    missing.forEach(m => {
      exportData[m.locale] = m.missing.reduce((acc, item) => {
        if (!acc[item.namespace]) acc[item.namespace] = [];
        acc[item.namespace].push(item.key);
        return acc;
      }, {});
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missing-translations-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalMissing = missing.reduce((sum, m) => sum + m.count, 0);

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Missing Translations</h1>
            <p className="text-muted-foreground">
              Translations that exist in English but not in other languages
            </p>
          </div>
          {totalMissing > 0 && (
            <Button onClick={exportMissing} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {missing.length === 0 ? (
        <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertDescription>
            No missing translations found! All languages are up to date.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Found {totalMissing} missing translations across {missing.length} languages
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Missing by Language</CardTitle>
              <CardDescription>Click on a language to see missing keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {missing.map((locale) => (
                  <AccordionItem key={locale.locale} value={locale.locale}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{locale.locale}</Badge>
                        <span className="text-lg font-medium">{locale.count} missing</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* Group by namespace */}
                        {Object.entries(
                          locale.missing.reduce((acc, item) => {
                            if (!acc[item.namespace]) acc[item.namespace] = [];
                            acc[item.namespace].push(item.key);
                            return acc;
                          }, {})
                        ).map(([namespace, keys]) => (
                          <div key={namespace} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{namespace}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {keys.length} keys
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {keys.map((key) => (
                                <div key={key} className="text-sm font-mono bg-muted p-2 rounded">
                                  {key}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
