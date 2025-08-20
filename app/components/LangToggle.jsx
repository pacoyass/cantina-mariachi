"use client"

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '../lib/useDynamicTranslation';

export function LangToggle() {
  const { t } = useTranslation('ui');
  const { changeLanguage, loading, availableLanguages, currentLanguage } = useLanguageSwitcher();

  // Fallback languages that will always be available
  const fallbackLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' },
  ];

  // Use backend languages if available, otherwise use fallbacks
  const displayLanguages = availableLanguages.length > 0 ? availableLanguages : fallbackLanguages;

  const handleLanguageChange = async (code) => {
    const success = await changeLanguage(code);
    if (success) {
      console.log(`Language changed to ${code}`);
    } else {
      console.warn(`Failed to change language to ${code}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('a11y.toggleLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="flex items-center mx-auto">
        {displayLanguages.map((lang) => {
          // Handle both backend format and fallback format
          const code = lang.code || lang;
          const label = lang.label || lang;
          
          return (
            <DropdownMenuItem 
              key={code} 
              onClick={() => handleLanguageChange(code)}
              className={code === currentLanguage ? 'bg-accent' : ''}
            >
              {label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}