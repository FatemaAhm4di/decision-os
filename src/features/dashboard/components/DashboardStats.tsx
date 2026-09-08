"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ListChecks,
  Target,
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
  const [stats, setStats] = useState<DashboardStatsData>(initialStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/decision", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }

        const decisions: DashboardDecision[] = await response.json();

        if (!isMounted) {
          return;
        }

        const totalOptions = decisions.reduce(
          (total, decision) => total + decision.options.length,
          0
        );

        const totalCriteria = decisions.reduce(
          (total, decision) => total + decision.criteria.length,
          0
        );

        setStats({
          totalDecisions: decisions.length,
          totalOptions,
          totalCriteria,
          completedDecisions: 0,
        });
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setStats(initialStats);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchStats();

    return () => {
      isMounted = false;
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
                  {isLoading ? "—" : card.value}
                </p>
              </div>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}