"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useTranslation } from 'react-i18next'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('ui')
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  function applyThemeFallback(next) {
    try {
      const root = document.documentElement
      if (!root) return
      // ensure only one of the classes is present
      root.classList.remove(next === 'dark' ? 'light' : 'dark')
      root.classList.add(next)
      try { localStorage.setItem('theme', next) } catch {}
    } catch {}
  }

  function handleQuickToggle() {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'dark'
    try { setTheme(next) } catch {}
    applyThemeFallback(next)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleQuickToggle}
          onPointerDown={(e) => { if (e.button === 0) handleQuickToggle() }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="min-w-[120px]">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t('theme.light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t('theme.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t('theme.system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
