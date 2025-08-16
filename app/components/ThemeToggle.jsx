
// import { useEffect, useState } from "react";
// import { useTheme } from "next-themes";
// import { Button } from "./ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

// export function ModeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon" aria-label="Toggle theme">
//           {theme === "dark" ? "🌙" : "☀️"}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>{theme === "light" ? "✓ " : ""}Light</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>{theme === "dark" ? "✓ " : ""}Dark</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>{theme === "system" ? "✓ " : ""}System</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from 'react-i18next'

export function ModeToggle() {
  const { setTheme } = useTheme()
  const { t } = useTranslation('ui')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="flex items-center mx-auto">
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
