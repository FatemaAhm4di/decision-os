
"use client";

import { useMemo, useState } from "react";

import {
  ArrowDownUp,
  FileSearch,
  Plus,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { DecisionStatus } from "@/types/decision";

import { useDecisions } from "../hooks/use-decisions";

import { CreateDecisionDialog } from "./create-decision-dialog";
import { DecisionCard } from "./decision-card";
import { DecisionSearch } from "./decision-search";
import { DecisionStats } from "./decision-stats";

type DecisionListProps = {
  compact?: boolean;
};

type StatusFilter = "ALL" | DecisionStatus;

type SortOption =
  | "NEWEST"
  | "OLDEST"
  | "RECENTLY_UPDATED"
  | "TITLE";

const statusFilters: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const sortOptions: {
  value: SortOption;
  label: string;
}[] = [
  { value: "NEWEST", label: "Newest first" },
  { value: "OLDEST", label: "Oldest first" },
  { value: "RECENTLY_UPDATED", label: "Recently updated" },
  { value: "TITLE", label: "Title (A–Z)" },
];

export function DecisionList({
  compact = false,
}: DecisionListProps) {
  const {
    decisions,
    isLoading,
    error,
    refetch,
  } = useDecisions();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] =
    useState<SortOption>("NEWEST");

  const normalizedDecisions = useMemo(
    () =>
      decisions.map((decision) => ({
        ...decision,
        status:
          decision.status ??
          (decision.isCompleted ? "COMPLETED" : "IN_PROGRESS"),
      })),
    [decisions]
  );

  const statusCounts = useMemo(
    () => ({
      ALL: normalizedDecisions.length,
      DRAFT: normalizedDecisions.filter(
        (decision) => decision.status === "DRAFT"
      ).length,
      IN_PROGRESS: normalizedDecisions.filter(
        (decision) => decision.status === "IN_PROGRESS"
      ).length,
      COMPLETED: normalizedDecisions.filter(
        (decision) => decision.status === "COMPLETED"
      ).length,
    }),
    [normalizedDecisions]
  );

  const filteredDecisions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedDecisions.filter((decision) => {
      const matchesSearch =
        !query || decision.title.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        decision.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [normalizedDecisions, search, statusFilter]);

  const sortedDecisions = useMemo(() => {
    const result = [...filteredDecisions];

    result.sort((a, b) => {
      switch (sortOrder) {
        case "OLDEST":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "RECENTLY_UPDATED":
          return (
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
          );

        case "TITLE":
          return a.title.localeCompare(b.title, undefined, {
            sensitivity: "base",
          });

        case "NEWEST":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [filteredDecisions, sortOrder]);

  const visibleDecisions = useMemo(
    () =>
      compact
        ? filteredDecisions.slice(0, 3)
        : sortedDecisions,
    [compact, filteredDecisions, sortedDecisions]
  );

  const totalOptions = useMemo(
    () =>
      decisions.reduce(
        (total, decision) =>
          total + (decision.options?.length ?? 0),
        0
      ),
    [decisions]
  );

  const totalCriteria = useMemo(
    () =>
      decisions.reduce(
        (total, decision) =>
          total + (decision.criteria?.length ?? 0),
        0
      ),
    [decisions]
  );

  if (isLoading) {
    return (
      <div
        className="space-y-8"
        aria-busy="true"
        aria-live="polite"
      >
        {!compact && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-border bg-muted/40"
              />
            ))}
          </div>
        )}

        {!compact && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:max-w-md" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-40" />
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-border bg-muted/40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center sm:px-10">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
          aria-hidden="true"
        >
          <TriangleAlert className="size-6" />
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-tight">
          Unable to load decisions
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          We couldn&apos;t load your decisions right now.
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => void refetch()}
        >
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  const hasDecisions = decisions.length > 0;
  const hasSearch = search.trim().length > 0;
  const hasActiveFilter =
    statusFilter !== "ALL" || hasSearch;
  const hasResults = visibleDecisions.length > 0;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setSortOrder("NEWEST");
  };

  if (compact && !hasDecisions) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center sm:px-10">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10"
          aria-hidden="true"
        >
          <Plus className="size-6 text-primary" />
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          No decisions yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Create your first decision to start comparing options
          and criteria.
        </p>

        <div className="mt-6 flex justify-center">
          <CreateDecisionDialog onCreated={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!compact && (
        <>
          <DecisionStats
            decisions={decisions.length}
            options={totalOptions}
            criteria={totalCriteria}
          />

          <div className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-md">
                <DecisionSearch
                  value={search}
                  onChange={setSearch}
                />
              </div>

              <CreateDecisionDialog onCreated={refetch} />
            </div>

            <div
              className="flex flex-wrap gap-2"
              aria-label="Filter decisions by status"
            >
              {statusFilters.map((filter) => {
                const isActive = statusFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setStatusFilter(filter.value)}
                    className={[
                      "inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2",
                      "text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    ].join(" ")}
                  >
                    {filter.label}

                    <span
                      className={[
                        "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
                        isActive
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {statusCounts[filter.value]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowDownUp className="size-4 shrink-0" />
                <label htmlFor="decision-sort">
                  Sort by
                </label>
              </div>

              <select
                id="decision-sort"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOption)
                }
                className="min-h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:w-52"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilter && hasDecisions && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredDecisions.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {decisions.length}
                </span>{" "}
                decisions
              </p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="shrink-0"
              >
                <RotateCcw className="size-4" />
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}

      {!compact && !hasDecisions ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center sm:px-10">
          <div
            className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10"
            aria-hidden="true"
          >
            <Plus className="size-6 text-primary" />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
            No decisions yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Start by creating your first decision. Add the
            options you are considering and the criteria that
            matter most.
          </p>

          <div className="mt-6 flex justify-center">
            <CreateDecisionDialog onCreated={refetch} />
          </div>
        </div>
      ) : !hasResults ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center sm:px-10">
          <div
            className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted"
            aria-hidden="true"
          >
            <FileSearch className="size-6 text-muted-foreground" />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
            No matching decisions
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {hasSearch && statusFilter !== "ALL"
              ? "No decisions match your search and selected status."
              : hasSearch
                ? `Nothing matches "${search.trim()}". Try a different keyword.`
                : `There are no ${statusFilter === "DRAFT" ? "draft" : statusFilter === "IN_PROGRESS" ? "in-progress" : "completed"} decisions yet.`}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={clearFilters}
          >
            <RotateCcw className="size-4" />
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              onDeleted={refetch}
              onStatusChanged={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
