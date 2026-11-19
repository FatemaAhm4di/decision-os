
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BarChart3,
  CheckCircle2,
  ListChecks,
  RotateCcw,
  Target,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

type DashboardDecision = {
  id: string;
  title: string;
  options: {
    id: string;
  }[];
  criteria: {
    id: string;
  }[];
  isCompleted?: boolean;
};

type DashboardStatsData = {
  totalDecisions: number;
  totalOptions: number;
  totalCriteria: number;
  completedDecisions: number;
};

const initialStats: DashboardStatsData = {
  totalDecisions: 0,
  totalOptions: 0,
  totalCriteria: 0,
  completedDecisions: 0,
};

export default function DashboardStats() {
  const [stats, setStats] =
    useState<DashboardStatsData>(initialStats);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadStats = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch("/api/decision", {
          cache: "no-store",
          signal,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to fetch dashboard statistics."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid dashboard response.");
        }

        const decisions = data as DashboardDecision[];

        const totalOptions = decisions.reduce(
          (total, decision) =>
            total + (decision.options?.length ?? 0),
          0
        );

        const totalCriteria = decisions.reduce(
          (total, decision) =>
            total + (decision.criteria?.length ?? 0),
          0
        );

        const completedDecisions = decisions.filter(
          (decision) => decision.isCompleted === true
        ).length;

        setStats({
          totalDecisions: decisions.length,
          totalOptions,
          totalCriteria,
          completedDecisions,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load dashboard statistics:",
          error
        );

        setHasError(true);
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadStats(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadStats]);

  const cards = [
    {
      label: "Total Decisions",
      value: stats.totalDecisions,
      description: "Decisions in your workspace",
      icon: BarChart3,
    },
    {
      label: "Options Compared",
      value: stats.totalOptions,
      description: "Choices across your decisions",
      icon: ListChecks,
    },
    {
      label: "Criteria Defined",
      value: stats.totalCriteria,
      description: "Factors used for comparison",
      icon: Target,
    },
    {
      label: "Completed",
      value: stats.completedDecisions,
      description: "Fully scored decisions",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      aria-label="Dashboard statistics"
      aria-busy={isLoading}
      className="space-y-3"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>

                  <p
                    className="mt-2 text-3xl font-bold tracking-tight text-foreground"
                    aria-live="polite"
                  >
                    {isLoading
                      ? "—"
                      : hasError
                        ? "—"
                        : card.value}
                  </p>
                </div>

                <div
                  className={[
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    hasError
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent text-accent-foreground",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {hasError ? (
                    <TriangleAlert className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {hasError
                  ? "Statistics are temporarily unavailable."
                  : card.description}
              </p>
            </div>
          );
        })}
      </div>

      {hasError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-destructive"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-foreground">
                Unable to load dashboard statistics
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Something went wrong while fetching your statistics.
                Please try again.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadStats()}
            disabled={isLoading}
            className="shrink-0"
          >
            <RotateCcw
              className="size-4"
              aria-hidden="true"
            />
            Try again
          </Button>
        </div>
      )}
    </section>
  );
}
