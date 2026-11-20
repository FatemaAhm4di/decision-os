
import Link from "next/link";

import { ArrowRight, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/Button";
import { DecisionList } from "@/features/decision/components/decision-list";

export default function RecentDecisions() {
  return (
    <section
      id="recent-decisions"
      aria-labelledby="recent-decisions-heading"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Your workspace
          </p>

          <h2
            id="recent-decisions-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Recent decisions
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Review your latest decisions and continue working on
            the choices that matter.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/decision"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto",
            })}
          >
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <Link
            href="/decision/new"
            className={buttonVariants({
              className: "w-full sm:w-auto",
            })}
          >
            <Plus className="size-4" aria-hidden="true" />
            New Decision
          </Link>
        </div>
      </div>

      <DecisionList compact />
    </section>
  );
}
