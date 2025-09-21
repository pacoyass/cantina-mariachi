import { NavLink } from "react-router"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Github, Instagram, Twitter } from "../lib/lucide-shim.js"
import { useTranslation } from 'react-i18next'

export function Footer() {
  const year = new Date().getFullYear()
  const { t } = useTranslation('ui')
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <div className="text-lg font-semibold">{t('brand')}</div>
          <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">{t('footer.quickLinks')}</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><NavLink to="/">{t('nav.home')}</NavLink></li>
            <li><NavLink to="/menu">{t('nav.menu')}</NavLink></li>
            <li><NavLink to="/orders">{t('nav.orders')}</NavLink></li>
            <li><NavLink to="/reservations">{t('nav.reservations')}</NavLink></li>
            <li><NavLink to="/account">{t('nav.account')}</NavLink></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">{t('footer.contact')}</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>123 Avenida de la Cocina</li>
            <li>+1 (555) 123-4567</li>
            <li>support@cantina.example</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">{t('footer.newsletter')}</div>
          <div className="flex gap-2 max-w-xs">
            <Input placeholder={t('footer.emailPlaceholder')} type="email" />
            <Button>{t('footer.join')}</Button>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground pt-2">
            <a href="#" aria-label="GitHub"><Github className="size-4" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="size-4" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="size-4" /></a>
          </div>
        </div>
      </div>
      <Separator />
      <div className="container mx-auto px-6 py-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>{t('footer.copyright', { year, brand: t('brand') })}</span>
        <div className="flex gap-3">
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  )
}