
// import { useTheme } from "next-themes";
// import { Button } from "../components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";

// export function ModeToggle() {
//   const { theme, setTheme } = useTheme();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon" aria-label="Toggle theme">
//           {theme === "dark" ? "🌙" : "☀️"}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           {theme === "light" ? "✓ " : ""}Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           {theme === "dark" ? "✓ " : ""}Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           {theme === "system" ? "✓ " : ""}System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          {theme === "dark" ? "🌙" : "☀️"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>{theme === "light" ? "✓ " : ""}Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{theme === "dark" ? "✓ " : ""}Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{theme === "system" ? "✓ " : ""}System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}