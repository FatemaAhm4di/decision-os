
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Scale,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function DashboardGuidance() {
  return (
    <section
      aria-labelledby="dashboard-guidance-heading"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
              aria-hidden="true"
            >
              <Lightbulb className="size-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-primary">
                Decision framework
              </p>

              <h2
                id="dashboard-guidance-heading"
                className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              >
                A clearer way to choose
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            Break a difficult choice into options and criteria,
            then give each criterion a weight based on how much it
            matters. Scoring the options turns a vague choice into
            a structured comparison.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:max-w-lg">
          <div className="rounded-xl border border-border bg-background p-4">
            <Scale
              className="size-5 text-primary"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-foreground">
              Define
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Identify your options and what matters most.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <CheckCircle2
              className="size-5 text-primary"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-foreground">
              Score
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Evaluate each option against your criteria.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <ArrowRight
              className="size-5 text-primary"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-foreground">
              Compare
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Use the weighted results to see the strongest choice.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Start with one decision and let the structure do the
          heavy lifting.
        </p>

        <Button
          render={<Link href="/decision/new" />}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Create a decision
          <ArrowRight
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </div>
    </section>
  );
}
