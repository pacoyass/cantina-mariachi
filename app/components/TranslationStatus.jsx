"use client"

import { useDynamicTranslation } from '../lib/useDynamicTranslation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Globe, Languages, FileText, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export function TranslationStatus() {
  const { 
    languages, 
    namespaces, 
    rtlLanguages, 
    loading, 
    error, 
    currentLanguage,
    refreshConfig 
  } = useDynamicTranslation();

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Translation Configuration...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fetching dynamic translation settings from backend...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Globe className="h-5 w-5" />
            Translation Configuration Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive mb-4">Failed to load dynamic translation configuration:</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshConfig} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      {/* Current Language Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Current Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={currentLanguage.rtl ? "destructive" : "default"}>
                {currentLanguage.code.toUpperCase()}
              </Badge>
              <span className="font-medium">{currentLanguage.name}</span>
              {currentLanguage.rtl && (
                <Badge variant="outline">RTL</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Priority: {currentLanguage.priority}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Available Languages ({languages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {languages.map((lang) => (
              <div 
                key={lang.code} 
                className={`p-2 rounded border ${
                  lang.code === currentLanguage.code 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={lang.rtl ? "destructive" : "default"} className="text-xs">
                    {lang.code.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium">{lang.name}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {lang.rtl && <Badge variant="outline" className="text-xs">RTL</Badge>}
                  <Badge variant="outline" className="text-xs">P:{lang.priority}</Badge>
                  {lang.fallback && (
                    <Badge variant="outline" className="text-xs">→{lang.fallback}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Namespaces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Namespaces ({namespaces.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {namespaces.map((ns) => (
              <Badge key={ns} variant="secondary" className="text-xs">
                {ns}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RTL Languages Summary */}
      {rtlLanguages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              RTL Languages ({rtlLanguages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {rtlLanguages.map((code) => (
                <Badge key={code} variant="destructive" className="text-xs">
                  {code.toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={refreshConfig} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Configuration
        </Button>
      </div>
    </div>
  );
}