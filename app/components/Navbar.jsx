import { NavLink } from "react-router"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { ModeToggle } from "./ThemeToggle"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from 'react-i18next'
import { LangToggle } from './LangToggle'

export function Navbar() {
  const { t } = useTranslation('ui')
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <Button variant="outline" className="px-2">
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
          <Button className="hidden md:inline-flex">{t('nav.orderNow')}</Button>
        </div>
      </nav>
      <div className="mex-divider" />
      <OfferBar />
    </header>
  )
}

function OfferBar() {
  const { t } = useTranslation('ui')
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y <= 64)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`overflow-hidden transition-[height] duration-300 ${visible ? 'h-8' : 'h-0'}`}>
      <div className={`will-change-transform transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-card/90 backdrop-blur text-card-foreground text-xs border-b">
          <div className="container mx-auto px-4 h-8 flex items-center justify-center">
            <span>{t('offer.freeDelivery')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}