import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const initial = document.documentElement.classList.contains("dark");
    setDark(initial);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
        setDark(true);
      }
    } catch {}
  }, []);

  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle theme">
      {dark ? "🌙" : "☀️"}
    </Button>
  );
}