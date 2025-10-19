import { NavLink, useLocation } from "react-router"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Github, Instagram, Twitter } from "../lib/lucide-shim.js"
import { useTranslation } from 'react-i18next'

export function Footer() {
  const year = new Date().getFullYear()
  const { t } = useTranslation('ui')
  const location = useLocation()
  
  // Check if we're on a page with a sidebar (cashier)
  const hasSidebar = location.pathname.startsWith('/cashier')
  
  return (
    <footer className={`border-t bg-background relative z-20 ${hasSidebar ? 'ml-64' : ''}`}>
      <div className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <div className="text-lg font-semibold">{t('brand')}</div>
          <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">{t('footer.quickLinks')}</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><NavLink to="/">{t('navigation.home')}</NavLink></li>
            <li><NavLink to="/menu">{t('navigation.menu')}</NavLink></li>
            <li><NavLink to="/orders">{t('navigation.orders')}</NavLink></li>
            <li><NavLink to="/reservations">{t('navigation.reservations')}</NavLink></li>
            <li><NavLink to="/account">{t('navigation.account')}</NavLink></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">{t('footer.contact')}</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>{t('footer.address')}</li>
            <li>{t('footer.phone')}</li>
            <li>{t('footer.email')}</li>
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