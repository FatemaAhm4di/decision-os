"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

import { navigationItems } from "./navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border px-5">
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
      </div>

      {/* Navigation */}
      <nav
        className="flex flex-1 flex-col gap-1 p-4"
        aria-label="Sidebar navigation"
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
                "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}