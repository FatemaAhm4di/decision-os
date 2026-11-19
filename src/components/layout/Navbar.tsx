
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, Menu, Moon, Sun, X } from "lucide-react";

import { navigationItems } from "./navigation";

export default function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const drawer = drawerRef.current;

      if (!drawer) {
        return;
      }

      const focusableElements = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle(
      "dark",
      !document.documentElement.classList.contains("dark"),
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Decision OS home"
        >
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
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
            <Moon aria-hidden="true" className="size-4 dark:hidden" />
            <Sun aria-hidden="true" className="hidden size-4 dark:block" />
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <aside
            ref={drawerRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute right-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col border-l border-border bg-background shadow-xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Decision OS home"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                </span>

                <span className="text-sm font-semibold text-foreground">
                  Decision OS
                </span>
              </Link>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close menu"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

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
                    <Icon aria-hidden="true" className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0 border-t border-border p-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                <span className="flex items-center gap-3">
                  <Moon aria-hidden="true" className="size-5 dark:hidden" />
                  <Sun aria-hidden="true" className="hidden size-5 dark:block" />

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
