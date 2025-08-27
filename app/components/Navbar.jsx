import { NavLink } from "react-router"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { ModeToggle } from "./ThemeToggle"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import { LangToggle } from './LangToggle'
import { track } from '../lib/utils'

export function Navbar({ initialStatus = { isOpen: true, etaMins: 25 } }) {
  const { t } = useTranslation('ui')
  // Start with SSR-provided status to avoid flicker (e.g., Open→Closed)
  const [status, setStatus] = useState(initialStatus)
  useEffect(() => {
    let active = true
    fetch('/api/config/public').then(r => r.ok ? r.json() : null).then(json => {
      if (!active || !json?.data?.status) return
      setStatus(json.data.status)
    }).catch(() => {})
    return () => { active = false }
  }, [])
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto grid grid-cols-3 h-14 items-center px-4">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" aria-label="Open menu">☰</Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-3">
                  <NavLink to="/">{t('nav.home')}</NavLink>
                  <NavLink to="/menu">{t('nav.menu')}</NavLink>
                  <NavLink to="/orders">{t('nav.orders')}</NavLink>
                  <NavLink to="/reservations">{t('nav.reservations')}</NavLink>
                  <NavLink to="/account">{t('nav.account')}</NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <NavLink to="/menu">{t('nav.menu')}</NavLink>
            <NavLink to="/orders">{t('nav.orders')}</NavLink>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <NavLink to="/" className="text-lg font-semibold">{t('brand')}</NavLink>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-4 text-sm mr-2">
            <NavLink to="/reservations">{t('nav.reservations')}</NavLink>
            <NavLink to="/account">{t('nav.account')}</NavLink>
          </div>
          <ModeToggle />
          <LangToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-2" aria-label="Account menu">
                <Avatar>
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><NavLink to="/account">{t('nav.profile')}</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild><NavLink to="/login">{t('nav.login')}</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild><NavLink to="/register">{t('nav.register')}</NavLink></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="hidden md:inline-flex" onClick={() => track('click_order_now_nav')}>{t('nav.orderNow')}</Button>
        </div>
      </nav>
      <div className="mex-divider" />
      <DesktopOrderBar isOpen={status.isOpen} eta={status.etaMins} />
    </header>
  )
}

function DesktopOrderBar({ isOpen, eta }) {
  const { t } = useTranslation('ui')
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // Only run on client after hydration
    if (typeof window === 'undefined') return
    
    setMounted(true)
    
    let raf = 0
    let lastScrollY = 0
    
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0
        
        // Hide when scrolling down, show when scrolling up or at top
        if (currentScrollY > 0 && currentScrollY > lastScrollY) {
          // Scrolling down - hide the bar
          setVisible(false)
        } else if (currentScrollY === 0 || currentScrollY < lastScrollY) {
          // At top or scrolling up - show the bar
          setVisible(true)
        }
        
        lastScrollY = currentScrollY
      })
    }
    
    // Initial check after hydration
    onScroll()
    
    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => { 
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Don't render scroll-dependent state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="hidden lg:block overflow-hidden transition-all duration-300 ease-in-out h-12 opacity-100">
        <div className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto h-12 px-4 grid grid-cols-3 items-center text-sm">
            <div className="flex items-center whitespace-nowrap">
              {isOpen ? t('topbar.open') : t('topbar.closed')} · {t('topbar.eta', { mins: eta })}
            </div>
            <div className="flex items-center justify-center">
              <span className="relative px-3 py-1 rounded-md text-xs font-medium">
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[var(--mex-green)] via-[var(--mex-gold)] to-[var(--mex-red)] opacity-20 blur-[2px]" />
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[var(--mex-green)] via-[var(--mex-gold)] to-[var(--mex-red)]">
                  {t('offer.freeDelivery')}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="text-muted-foreground hidden md:block whitespace-nowrap">{t('topbar.noSignup')}</div>
              <NavLink to="/menu" className="underline whitespace-nowrap">{t('topbar.browse')}</NavLink>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`hidden lg:block overflow-hidden transition-all duration-300 ease-in-out ${
      visible ? 'h-12 opacity-100' : 'h-0 opacity-0'
    }`}>
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto h-12 px-4 grid grid-cols-3 items-center text-sm">
          <div className="flex items-center whitespace-nowrap">
            {isOpen ? t('topbar.open') : t('topbar.closed')} · {t('topbar.eta', { mins: eta })}
          </div>
          <div className="flex items-center justify-center">
            <span className="relative px-3 py-1 rounded-md text-xs font-medium">
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[var(--mex-green)] via-[var(--mex-gold)] to-[var(--mex-red)] opacity-20 blur-[2px]" />
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[var(--mex-green)] via-[var(--mex-gold)] to-[var(--mex-red)]">
                {t('offer.freeDelivery')}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="text-muted-foreground hidden md:block whitespace-nowrap">{t('topbar.noSignup')}</div>
            <NavLink to="/menu" className="underline whitespace-nowrap">{t('topbar.browse')}</NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}