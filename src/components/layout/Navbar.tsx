
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Menu, Moon, Sun, X } from "lucide-react";

import { navigationItems } from "./navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle(
      "dark",
      !document.documentElement.classList.contains("dark"),
    );
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Decision OS home"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Check className="size-5" strokeWidth={2.5} />
          </span>

          <span className="text-base font-semibold tracking-tight text-foreground">
            Decision OS
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <Moon className="size-4 dark:hidden" />
            <Sun className="hidden size-4 dark:block" />
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <aside
            id="mobile-navigation"
            className="absolute right-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col border-l border-border bg-background shadow-xl"
            aria-label="Mobile navigation"
          >
            {/* Drawer Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Decision OS home"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Check className="size-4" strokeWidth={2.5} />
                </span>

                <span className="text-sm font-semibold text-foreground">
                  Decision OS
                </span>
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav
              className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
              aria-label="Mobile navigation"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
                      "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Theme */}
            <div className="shrink-0 border-t border-border p-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                <span className="flex items-center gap-3">
                  <Moon className="size-5 dark:hidden" />
                  <Sun className="hidden size-5 dark:block" />

                  <span className="dark:hidden">Dark mode</span>
                  <span className="hidden dark:inline">Light mode</span>
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
