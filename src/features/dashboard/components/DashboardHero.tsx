import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10">
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur">
            <Sparkles
              className="size-4 text-primary"
              aria-hidden="true"
            />
            Decision workspace
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Make better decisions,
            <span className="block text-primary">
              one choice at a time.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Compare your options, weigh what matters, and turn
            complex choices into clear, structured decisions.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/decision/new">
              <Button
                size="lg"
                className="w-full sm:w-auto"
              >
                <Plus
                  className="size-4"
                  aria-hidden="true"
                />
                New Decision
                <ArrowRight
                  className="size-4"
                  aria-hidden="true"
                />
              </Button>
            </Link>

            <Link href="/decision">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                View Decisions
              </Button>
            </Link>
          </div>

          <div className="mt-7 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Weighted criteria
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Score-based comparison
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Clear recommendations
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 lg:block">
          <div className="relative flex size-44 items-center justify-center rounded-3xl border border-border bg-background/70 shadow-sm backdrop-blur">
            <div className="absolute inset-5 rounded-2xl border border-border" />

            <div className="relative flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <CheckCircle2
                className="size-10"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}