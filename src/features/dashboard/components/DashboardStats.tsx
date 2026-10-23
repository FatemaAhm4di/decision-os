"use client";

import { useEffect, useState } from "react";

import {
  BarChart3,
  CheckCircle2,
  ListChecks,
  Target,
  TriangleAlert,
} from "lucide-react";

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

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch("/api/decision", {
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to fetch dashboard statistics"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid dashboard response");
        }

        const decisions = data as DashboardDecision[];

        if (cancelled) {
          return;
        }

        const totalOptions = decisions.reduce(
          (total, decision) =>
            total + decision.options.length,
          0
        );

        const totalCriteria = decisions.reduce(
          (total, decision) =>
            total + decision.criteria.length,
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
        console.error(
          "Failed to load dashboard statistics:",
          error
        );

        if (!cancelled) {
          setStats(initialStats);
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

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
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
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

                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                  {isLoading ? "—" : hasError ? "!" : card.value}
                </p>
              </div>

              <div
                className={[
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  hasError
                    ? "bg-destructive/10 text-destructive"
                    : "bg-accent text-accent-foreground",
                ].join(" ")}
              >
                {hasError ? (
                  <TriangleAlert
                    className="size-5"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon
                    className="size-5"
                    aria-hidden="true"
                  />
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
    </section>
  );
}