import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  function toggle() {
    setTheme(dark ? "light" : "dark");
  }
  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle theme">
      {dark ? "🌙" : "☀️"}
    </Button>
  );
}