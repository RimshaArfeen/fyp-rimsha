"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({
  className = "",
  tone = "onPrimary",
}: {
  className?: string;
  tone?: "onPrimary" | "light";
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem("pulse-theme") === "dark";
    } catch {}
    if (saved) document.documentElement.setAttribute("data-theme", "dark");
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("pulse-theme", next ? "dark" : "light");
    } catch {}
  };

  const look =
    tone === "light"
      ? "border-border bg-card text-foreground hover:bg-accent"
      : "border-white/20 text-white/80 hover:bg-white/10";

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${look} ${className}`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}