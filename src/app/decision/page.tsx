import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DecisionList } from "@/features/decision/components/decision-list";

export default function DecisionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to dashboard
          </Link>

          <p className="text-sm font-medium text-primary">
            Decision workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your decisions
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Review, compare, and manage the decisions you have created.
          </p>
        </div>

        <Link href="/decision/new">
          <Button className="w-full sm:w-auto">
            <Plus className="size-4" />
            New Decision
          </Button>
        </Link>
      </section>

      {/* Decisions */}
      <DecisionList />
    </div>
  );
}