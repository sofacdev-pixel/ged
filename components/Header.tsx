// components/header/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Search as SearchIcon, Moon, SunMedium } from "lucide-react";

type NavItem = { title: string; href: string };

const nav: NavItem[] = [
  { title: "Vue d’ensemble", href: "/vue-ensemble" },
  { title: "Recherche", href: "/recherche" },
  { title: "Acquisition", href: "/acquisition-des-documents" },
  { title: "Content Server", href: "/recherche/content-server" },
];

function LogoMark() {
  return (
    <div className="relative h-6 w-6 rounded-md border border-black/10 dark:border-white/10">
      <div className="absolute inset-0 rounded-md bg-gradient-to-br from-black/5 to-black/0 dark:from-white/10 dark:to-transparent" />
    </div>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className="inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
      aria-label="Basculer le thème"
      title="Basculer le thème"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? "Clair" : "Sombre"}</span>
    </button>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      className="group inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
      aria-label="Ouvrir la recherche"
      title="Ouvrir la recherche (⌘K)"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      }}
    >
      <SearchIcon className="h-4 w-4 opacity-70" />
      <span className="text-gray-700 dark:text-gray-300">Rechercher</span>
      <kbd className="ml-1 hidden items-center rounded border px-1.5 text-[10px] opacity-70 sm:inline-flex">
        ⌘K
      </kbd>
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight">
              SOFAGED - Documentations
            </span>
          </Link>
        </div>

        {/* Right: actions (desktop only) */}
        <div className="hidden items-center gap-2 md:flex">
          <SearchButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
