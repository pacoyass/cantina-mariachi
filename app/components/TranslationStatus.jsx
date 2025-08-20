"use client"

import { useDynamicTranslation } from '../lib/useDynamicTranslation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Globe, Languages, FileText } from 'lucide-react';

export function TranslationStatus() {
  const { 
    languages, 
    namespaces, 
    rtlLanguages, 
    currentLanguage,
    isRTL
  } = useDynamicTranslation();

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      {/* Configuration Source */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Globe className="h-5 w-5" />
            Configuration Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600">
              Static Configuration
            </Badge>
            <span className="text-sm text-green-700">
              Using built-in language and namespace configuration
            </span>
          </div>
        </CardContent>
      </Card>

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
              <Badge variant={isRTL ? "destructive" : "default"}>
                {currentLanguage.code.toUpperCase()}
              </Badge>
              <span className="font-medium">{currentLanguage.name}</span>
              {isRTL && (
                <Badge variant="outline">RTL</Badge>
              )}
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
    </div>
  );
}