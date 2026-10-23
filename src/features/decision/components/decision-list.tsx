"use client";

import { useMemo, useState } from "react";

import {
  FileSearch,
  Plus,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { useDecisions } from "../hooks/use-decisions";

import { CreateDecisionDialog } from "./create-decision-dialog";
import { DecisionCard } from "./decision-card";
import { DecisionSearch } from "./decision-search";
import { DecisionStats } from "./decision-stats";

type DecisionListProps = {
  compact?: boolean;
};

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

  const filteredDecisions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return decisions;
    }

    return decisions.filter((decision) =>
      decision.title.toLowerCase().includes(query)
    );
  }, [decisions, search]);

  const visibleDecisions = useMemo(() => {
    if (compact) {
      return filteredDecisions.slice(0, 3);
    }

    return filteredDecisions;
  }, [compact, filteredDecisions]);

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
  const hasResults = visibleDecisions.length > 0;

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

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
              <DecisionSearch
                value={search}
                onChange={setSearch}
              />
            </div>

            <CreateDecisionDialog onCreated={refetch} />
          </div>

          {hasSearch && hasDecisions && (
            <div className="flex items-center justify-between gap-4">
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
                onClick={() => setSearch("")}
                className="shrink-0"
              >
                Clear search
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
            Nothing matches{" "}
            <span className="font-medium text-foreground">
              &quot;{search.trim()}&quot;
            </span>
            . Try a different keyword.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => setSearch("")}
          >
            <RotateCcw className="size-4" />
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              onDeleted={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}