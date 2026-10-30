
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Layers3,
  Scale,
  Sparkles,
} from "lucide-react";

const productLinks = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "All Decisions", href: "/decision", icon: Scale },
  { label: "Templates", href: "/templates", icon: Layers3 },
];

const features = [
  "Weighted decision scoring",
  "Structured comparisons",
  "Clear result analysis",
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "X", href: "https://x.com/" },
];

function SocialIcon({ label }: { label: string }) {
  if (label === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.8 2.02 3.16 2.02.29-.45.62-.77 1-1.01-2.48-.28-5.08-1.24-5.08-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.27-2.6 5.21-5.09 5.49.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
        <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.34H4.96V9.1h2.97v9.24ZM6.45 7.84a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm11.9 10.5h-2.96v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58H9.2V9.1h2.84v1.26h.04c.4-.73 1.36-1.5 2.8-1.5 3 0 3.55 1.97 3.55 4.53v4.95Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-8.02L5.03 22H1.9l7.25-8.3L1.4 2h6.4l4.43 7.37L18.9 2Zm-1.1 18h1.73L6.88 3.89H5.02L17.8 20Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border bg-muted text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-32 -top-40 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 size-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label="Decision OS home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Scale className="size-6" strokeWidth={1.8} />
              </span>

              <span>
                <span className="block text-lg font-bold tracking-tight">
                  Decision OS
                </span>
                <span className="block text-xs font-medium tracking-widest text-muted-foreground">
                  THINK · COMPARE · DECIDE
                </span>
              </span>
            </Link>

            <h2 className="mt-7 max-w-md text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Better decisions start with
              <span className="text-primary"> better thinking.</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              A structured decision-making workspace that helps you compare
              options, evaluate priorities, and make choices with clarity
              and confidence.
            </p>

            {/* Social links */}
            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Connect with us
              </p>

              <div className="flex items-center gap-2">
                {socialLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${label}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-border bg-background/70 text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <SocialIcon label={label} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold">Explore</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Navigate your workspace
            </p>

            <nav aria-label="Footer navigation" className="mt-6">
              <ul className="space-y-4">
                {productLinks.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-4 text-primary/80 transition-transform group-hover:scale-110" />
                      <span>{label}</span>
                      <ArrowUpRight className="ml-auto size-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Features */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold">What you can do</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Tools designed around better decisions
            </p>

            <ul className="mt-6 space-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl border border-border bg-background/60 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Sparkles className="size-4" />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Make every choice count.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Turn complex choices into structured, understandable
                    decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Decision OS. All rights reserved.
          </p>

          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <span className="flex size-7 items-center justify-center rounded-full border border-border transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="size-3.5 -rotate-45" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
