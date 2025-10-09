import { NavLink, useLoaderData, useOutletContext, useSubmit } from "react-router"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { ModeToggle } from "../components/ThemeToggle"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { useEffect, useState, useRef } from "react"
import { useTranslation } from 'react-i18next'
import { LangToggle } from '../components/LangToggle'
import { track } from '../lib/utils'
import { checkAuthToken } from "@/utils/auth/authUtils"

export function Navbar( {initialStatus = { isOpen: true, etaMins: 25 } ,user}) {

  console.log("from nav",user);
  const submit = useSubmit();

  const handleLogout = () => {
    submit(null, { action: "/logout", method: "post" });
  };
  const { t } = useTranslation('ui')
  // Start with SSR-provided status to avoid flicker (e.g., Open→Closed)
  const [status, setStatus] = useState(initialStatus)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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
                  <NavLink to="/menu">{t('navigation.menu')}</NavLink>
                  <NavLink to="/orders">{t('navigation.orders')}</NavLink>
                  <NavLink to="/reservations">{t('navigation.reservations')}</NavLink>
                  <NavLink to="/account">{t('navigation.account')}</NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <NavLink to="/menu">{t('navigation.menu')}</NavLink>
            <NavLink to="/orders">{t('navigation.orders')}</NavLink>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <NavLink to="/" className="text-lg font-semibold">{t('brand')}</NavLink>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-4 text-sm mr-2">
            <NavLink to="/reservations">{t('navigation.reservations')}</NavLink>
            <NavLink to="/account">{t('navigation.account')}</NavLink>
          </div>
          <ModeToggle />
          <LangToggle />
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-2" aria-label="Account menu" onClick={() => setUserMenuOpen((o) => !o)}>
                <Avatar>
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><NavLink to="/account">{t('navigation.account')}</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild><NavLink to="/login">{t('buttons.login')}</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild><NavLink to="/register">{t('buttons.signup')}</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button variant="ghost" onClick={handleLogout}>
                  {t('buttons.logout')}
                </Button></DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="hidden md:inline-flex" onClick={() => track('click_order_now_nav')}>{t('buttons.orderNow')}</Button>
        </div>
      </nav>
      <div className="mex-divider" />
      <DesktopOrderBar isOpen={status.isOpen} eta={status.etaMins} />
    </header>
  )
}

function DesktopOrderBar({ isOpen, eta }) {
  const { t } = useTranslation('ui')
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const revealDelayRef = useRef(null)
  const lastToggleRef = useRef(0)
  const visibleRef = useRef(false)
  
  useEffect(() => {
    // Only run on client after hydration
    if (typeof window === 'undefined') return
    
    // Delay initial appearance to smooth out page load
    const INITIAL_APPEAR_DELAY_MS = 120
    revealDelayRef.current = setTimeout(() => setMounted(true), INITIAL_APPEAR_DELAY_MS)
    
    let raf = 0
    let lastScrollY = 0
    const SHOW_AT_TOP_PX = 4
    const TOGGLE_DEBOUNCE_MS = 50
    
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0
        
        // Debounce rapid visibility flips
        const now = Date.now()
        if (now - lastToggleRef.current < TOGGLE_DEBOUNCE_MS) {
          lastScrollY = currentScrollY
          return
        }

        // Show ONLY when at (or extremely near) the very top
        const nextVisible = currentScrollY <= SHOW_AT_TOP_PX

        if (nextVisible !== visibleRef.current) {
          visibleRef.current = nextVisible
          setVisible(nextVisible)
          lastToggleRef.current = now
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
      if (revealDelayRef.current) clearTimeout(revealDelayRef.current)
    }
  }, [])

  // Before mount delay finishes, keep bar hidden to control appearance timing
  if (!mounted) {
    return (
      <div className="hidden lg:block overflow-hidden transition-all duration-300 ease-in-out h-0 opacity-0" />
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