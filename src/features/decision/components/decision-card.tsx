
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  FolderKanban,
  ListTodo,
  SlidersHorizontal,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import type { DecisionStatus } from "@/types/decision";

import { DeleteDecisionButton } from "./delete-decision-button";
import { DecisionStatusButton } from "./decision-status-button";

type DecisionCardDecision = {
  id: string;
  title: string;
  createdAt: string | Date;
  status?: DecisionStatus;
  isCompleted?: boolean;
  options?: {
    id: string;
    name?: string;
  }[];
  criteria?: {
    id: string;
    name?: string;
    weight?: number;
  }[];
};

type DecisionCardProps = {
  decision: DecisionCardDecision;
  onDeleted: () => void | Promise<void>;
  onStatusChanged: () => void | Promise<void>;
};

const statusConfig: Record<
  DecisionStatus,
  {
    label: string;
    description: string;
    icon: typeof FolderKanban;
    badgeClass: string;
    iconClass: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    description: "This decision is saved as a draft.",
    icon: FolderKanban,
    badgeClass: "border-border bg-muted text-muted-foreground",
    iconClass: "bg-muted text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    description: "Complete your evaluation and finalize your decision.",
    icon: CircleDashed,
    badgeClass: "border-primary/20 bg-primary/10 text-primary",
    iconClass: "bg-primary/10 text-primary",
  },
  COMPLETED: {
    label: "Completed",
    description: "This decision has been marked as final.",
    icon: CheckCircle2,
    badgeClass: "border-primary/20 bg-primary/10 text-primary",
    iconClass: "bg-primary/15 text-primary",
  },
};

export function DecisionCard({
  decision,
  onDeleted,
  onStatusChanged,
}: DecisionCardProps) {
  const optionCount = decision.options?.length ?? 0;
  const criterionCount = decision.criteria?.length ?? 0;

  const status: DecisionStatus =
    decision.status ??
    (decision.isCompleted ? "COMPLETED" : "IN_PROGRESS");

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const parsedDate = new Date(decision.createdAt);

  const createdAt = Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsedDate);

  return (
    <Card
      className={[
        "group relative overflow-hidden rounded-3xl border bg-background/80",
        "backdrop-blur transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl",
        "motion-reduce:transform-none motion-reduce:transition-none",
        "motion-reduce:hover:transform-none",
      ].join(" ")}
    >
      <div
        className={[
          "absolute left-0 top-0 h-full w-1 transition-all duration-300",
          status === "COMPLETED"
            ? "bg-primary"
            : "bg-primary/20 group-hover:bg-primary",
        ].join(" ")}
        aria-hidden="true"
      />

      <CardHeader className="pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={[
                "flex size-14 shrink-0 items-center justify-center rounded-2xl",
                "ring-1 transition-all duration-300",
                "group-hover:scale-105 group-hover:shadow-lg",
                "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                currentStatus.iconClass,
                "ring-primary/15",
              ].join(" ")}
              aria-hidden="true"
            >
              <StatusIcon className="size-6" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <div
                className={[
                  "mb-3 inline-flex items-center gap-1.5 rounded-full",
                  "border px-3 py-1 text-xs font-medium",
                  currentStatus.badgeClass,
                ].join(" ")}
              >
                <StatusIcon className="size-3.5" aria-hidden="true" />
                {currentStatus.label}
              </div>

              <CardTitle
                className={[
                  "line-clamp-2 text-xl font-bold tracking-tight",
                  "transition-colors duration-300 group-hover:text-primary",
                  "motion-reduce:transition-none",
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div
            className={[
              "rounded-2xl border bg-muted/30 p-3 sm:p-5",
              "transition-all duration-300 group-hover:bg-muted/50",
              "motion-reduce:transition-none",
            ].join(" ")}
          >
            <ListTodo
              className="mb-3 size-5 text-primary sm:mb-4"
              aria-hidden="true"
            />

            <p className="text-2xl font-bold text-foreground sm:text-3xl">
              {optionCount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">Options</p>
          </div>

          <div
            className={[
              "rounded-2xl border bg-muted/30 p-3 sm:p-5",
              "transition-all duration-300 group-hover:bg-muted/50",
              "motion-reduce:transition-none",
            ].join(" ")}
          >
            <SlidersHorizontal
              className="mb-3 size-5 text-primary sm:mb-4"
              aria-hidden="true"
            />

            <p className="text-2xl font-bold text-foreground sm:text-3xl">
              {criterionCount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">Criteria</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <div
              className={[
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                currentStatus.iconClass,
              ].join(" ")}
              aria-hidden="true"
            >
              <StatusIcon className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {status === "COMPLETED"
                  ? "Decision is completed"
                  : status === "DRAFT"
                    ? "Decision is a draft"
                    : "Scoring in progress"}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {currentStatus.description}
              </p>
            </div>
          </div>
        </div>

        <DecisionStatusButton
          decisionId={decision.id}
          status={status}
          onUpdated={onStatusChanged}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/decision/${decision.id}`}
            className={buttonVariants({
              className: "group w-full flex-1",
            })}
          >
            Open Decision

            <ArrowRight
              className={[
                "ml-2 size-4 transition-transform duration-300",
                "group-hover:translate-x-1",
                "motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
              ].join(" ")}
              aria-hidden="true"
            />
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
