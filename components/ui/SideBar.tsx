
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowLeft, FileText, Search, Home, View, LayoutDashboard } from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type Item = { title: string; href: string; icon?: IconType };

const itemsRaw: Item[] = [
  { icon: Home, title: "Home", href: "/" },
  { icon: LayoutDashboard, title: "Vue d’ensemble", href: "/overview" },
  { icon: FileText, title: "Acquisition des documents", href: "/acquisition-des-documents" },
  
  { icon: Search,    title: "Recherche", href: "/recherche" },
  { icon: View,    title: "Consultation des documents", href: "/consultation-des-documents" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Dedup by href (avoids duplicates if array changes elsewhere)
  const items = useMemo<Item[]>(
    () => Array.from(new Map(itemsRaw.map((i) => [i.href, i])).values()),
    []
  );

  return (
    <aside className="md:w-64 py-32">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden mb-3 inline-flex items-center gap-2 rounded border px-3 py-2 text-sm"
        aria-expanded={open}
        aria-controls="sidebar-nav"
      >
        <Menu size={16} />
        Menu
      </button>

      <nav
        id="sidebar-nav"
        aria-label="Navigation principale"
        className={clsx(
          "  h-full p-4 rounded",
          open ? "block" : "hidden md:block"
        )}
      >
        <ul className="space-y-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                    isActive
                      ? " font-semibold"
                      : "text-muted-foreground dark:text-muted-foreground dark:hover:bg-card hover:bg-gray-50"
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4 opacity-70" /> : null}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}