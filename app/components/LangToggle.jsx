"use client"

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '../lib/useDynamicTranslation';

export function LangToggle() {
  const { t } = useTranslation('ui');
  const { changeLanguage, loading, availableLanguages, currentLanguage } = useLanguageSwitcher();

  const handleLanguageChange = async (code) => {
    const success = await changeLanguage(code);
    if (success) {
      console.log(`Language changed to ${code}`);
    } else {
      console.warn(`Failed to change language to ${code}`);
    }
  };

  if (loading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{t('a11y.toggleLanguage')}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('a11y.toggleLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="flex items-center mx-auto">
        {availableLanguages.map((code) => (
          <DropdownMenuItem 
            key={code} 
            onClick={() => handleLanguageChange(code)}
            className={code === currentLanguage ? 'bg-accent' : ''}
          >
            {code === 'en' && 'English'}
            {code === 'es' && 'Español'}
            {code === 'fr' && 'Français'}
            {code === 'de' && 'Deutsch'}
            {code === 'it' && 'Italiano'}
            {code === 'pt' && 'Português'}
            {code === 'ar' && 'العربية'}
            {code === 'de-CH' && 'Schweizerdeutsch'}
            {code === 'fr-CH' && 'Français Suisse'}
            {code === 'it-CH' && 'Italiano Svizzero'}
            {!['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'de-CH', 'fr-CH', 'it-CH'].includes(code) && code}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}