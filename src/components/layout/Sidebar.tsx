"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Moon, Sun } from "lucide-react";

import { navigationItems } from "./navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle(
      "dark",
      !document.documentElement.classList.contains("dark"),
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-sidebar md:flex md:flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Decision OS home"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Check className="size-5" strokeWidth={2.5} />
          </span>

          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
            Decision OS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
        aria-label="Main navigation"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme */}
      <div className="shrink-0 border-t border-sidebar-border p-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <span className="flex items-center gap-3">
            <Moon className="size-4 dark:hidden" />
            <Sun className="hidden size-4 dark:block" />

            <span className="dark:hidden">Dark mode</span>
            <span className="hidden dark:inline">Light mode</span>
          </span>
        </button>
      </div>
    </aside>
  );
}