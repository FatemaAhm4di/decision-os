import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { DeleteDecisionButton } from "./delete-decision-button";

type DecisionCardDecision = {
  id: string;
  title: string;
  createdAt: string | Date;
  options?: {
    id: string;
    name?: string;
  }[];
  criteria?: {
    id: string;
    name?: string;
    weight?: number;
  }[];
  isCompleted?: boolean;
};

type DecisionCardProps = {
  decision: DecisionCardDecision;
  onDeleted: () => void;
};

export function DecisionCard({
  decision,
  onDeleted,
}: DecisionCardProps) {
  const optionCount = decision.options?.length ?? 0;
  const criterionCount = decision.criteria?.length ?? 0;
  const isCompleted = decision.isCompleted === true;

  const createdAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(decision.createdAt));

  return (
    <Card
      className={[
        "group relative overflow-hidden rounded-3xl border bg-background/80",
        "backdrop-blur transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl",
      ].join(" ")}
    >
      <div
        className={[
          "absolute left-0 top-0 h-full w-1 transition-all duration-300",
          isCompleted
            ? "bg-primary group-hover:bg-primary"
            : "bg-primary/20 group-hover:bg-primary",
        ].join(" ")}
      />

      <CardHeader className="pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={[
                "flex size-14 shrink-0 items-center justify-center rounded-2xl",
                "ring-1 transition-all duration-300",
                "group-hover:scale-105 group-hover:shadow-lg",
                isCompleted
                  ? "bg-primary/15 text-primary ring-primary/20"
                  : "bg-primary/10 text-primary ring-primary/15 group-hover:bg-primary/15",
              ].join(" ")}
            >
              {isCompleted ? (
                <CheckCircle2
                  className="size-6 transition-transform duration-300 group-hover:rotate-6"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <FolderKanban
                  className="size-6 transition-transform duration-300 group-hover:rotate-6"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <div
                className={[
                  "mb-3 inline-flex items-center gap-1.5 rounded-full",
                  "border px-3 py-1 text-xs font-medium",
                  isCompleted
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-border bg-primary/5 text-primary",
                ].join(" ")}
              >
                {isCompleted ? (
                  <CheckCircle2
                    className="size-3.5"
                    aria-hidden="true"
                  />
                ) : (
                  <Sparkles
                    className="size-3.5"
                    aria-hidden="true"
                  />
                )}

                {isCompleted ? "Completed" : "In progress"}
              </div>

              <CardTitle
                className={[
                  "line-clamp-2 text-xl font-bold tracking-tight",
                  "transition-colors duration-300 group-hover:text-primary",
                ].join(" ")}
              >
                {decision.title}
              </CardTitle>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />

                <span>{createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div
            className={[
              "rounded-2xl border bg-muted/30 p-5",
              "transition-all duration-300 group-hover:bg-muted/50",
            ].join(" ")}
          >
            <ListTodo
              className="mb-4 size-5 text-primary"
              aria-hidden="true"
            />

            <p className="text-3xl font-bold text-foreground">
              {optionCount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Options
            </p>
          </div>

          <div
            className={[
              "rounded-2xl border bg-muted/30 p-5",
              "transition-all duration-300 group-hover:bg-muted/50",
            ].join(" ")}
          >
            <SlidersHorizontal
              className="mb-4 size-5 text-primary"
              aria-hidden="true"
            />

            <p className="text-3xl font-bold text-foreground">
              {criterionCount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Criteria
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <div
              className={[
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                isCompleted
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
              aria-hidden="true"
            >
              {isCompleted ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Sparkles className="size-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {isCompleted
                  ? "Decision is ready"
                  : "Scoring in progress"}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {isCompleted
                  ? "All options have been scored against every criterion."
                  : "Complete the score matrix to get your final ranking."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/decision/${decision.id}`}
            className="flex-1"
          >
            <Button className="group w-full">
              Open Decision

              <ArrowRight
                className={[
                  "ml-2 size-4 transition-transform duration-300",
                  "group-hover:translate-x-1",
                ].join(" ")}
                aria-hidden="true"
              />
            </Button>
          </Link>

          <DeleteDecisionButton
            decisionId={decision.id}
            onDeleted={onDeleted}
          />
        </div>
      </CardContent>
    </Card>
  );
}