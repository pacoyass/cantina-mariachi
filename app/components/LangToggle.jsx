"use client"

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '../lib/useDynamicTranslation';
import { useState, useCallback } from 'react';

export function LangToggle() {
  const { t } = useTranslation('ui');
  const { changeLanguage, currentLanguage, loading } = useLanguageSwitcher();
  const [isChanging, setIsChanging] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' },
  ];

  const handleLanguageChange = useCallback(async (code) => {
    // Prevent multiple rapid clicks
    if (isChanging || loading) {
      console.log('Language change in progress, ignoring click');
      return;
    }

    // Prevent changing to the same language
    if (code === currentLanguage) {
      console.log('Already on language:', code);
      return;
    }

    try {
      setIsChanging(true);
      const success = await changeLanguage(code);
      if (success) {
        console.log(`Language changed to ${code}`);
      } else {
        console.warn(`Failed to change language to ${code}`);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      // Reset state after a short delay
      setTimeout(() => {
        setIsChanging(false);
      }, 200);
    }
  }, [changeLanguage, currentLanguage, isChanging, loading]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isChanging || loading}>
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('a11y.toggleLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="flex items-center mx-auto">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)}
            className={lang.code === currentLanguage ? 'bg-accent' : ''}
            disabled={isChanging || loading}
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