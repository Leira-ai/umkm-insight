"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("umkm-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-button"
      aria-label={dark ? "Gunakan tema terang" : "Gunakan tema gelap"}
      title={dark ? "Tema terang" : "Tema gelap"}
    >
      {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
