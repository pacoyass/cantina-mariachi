"use client"

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '../lib/useDynamicTranslation';

export function LangToggle() {
  const { t } = useTranslation('ui');
  const { changeLanguage, currentLanguage, loading } = useLanguageSwitcher();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' },
  ];

  const handleLanguageChange = async (code) => {
    // Prevent action if already loading or same language
    if (loading || code === currentLanguage) {
      return;
    }
    
    try {
      const success = await changeLanguage(code);
      if (success) {
        console.log(`✅ Language switched to ${code}`);
      } else {
        console.warn(`⚠️ Failed to switch to ${code}`);
      }
    } catch (error) {
      console.error('❌ Error changing language:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label={t('a11y.toggleLanguage')}
          disabled={loading}
          onClick={() => {
            // Fallback: cycle languages if menu cannot open (e.g., if portal blocked)
            const order = languages.map(l => l.code);
            const idx = Math.max(0, order.indexOf(currentLanguage));
            const next = order[(idx + 1) % order.length];
            handleLanguageChange(next);
          }}
        >
          <Globe className={`h-[1.2rem] w-[1.2rem] ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)}
            className={lang.code === currentLanguage ? 'bg-accent' : ''}
            disabled={loading}
          >
            {lang.label}
            {lang.code === currentLanguage && (
              <span className="ml-2 text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}