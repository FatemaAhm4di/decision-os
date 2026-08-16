import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DecisionList } from "@/features/decision/components/decision-list";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            Decision OS
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Make smarter decisions
            <span className="block text-primary">
              with confidence.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Compare your options, define what matters,
            assign weighted criteria, and let a structured
            decision matrix reveal the strongest choice.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/decision/new">
              <Button
                size="lg"
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                Create Decision
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>

            <a href="#decisions">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                View Decisions
              </Button>
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Weighted criteria
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Score-based comparison
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Clear recommendations
            </div>
          </div>
        </div>
      </section>

      {/* Decisions */}
      <section
        id="decisions"
        className="mt-14"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Your workspace
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Your decisions
            </h2>

            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Review existing decisions or create a new
              one when something important needs a clearer
              answer.
            </p>
          </div>

          <Link href="/decision/new">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              New Decision
            </Button>
          </Link>
        </div>

        <DecisionList />
      </section>
    </main>
  );
}