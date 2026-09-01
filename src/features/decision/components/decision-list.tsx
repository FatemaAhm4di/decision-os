"use client";

import { useMemo, useState } from "react";

import {
  FileSearch,
  Plus,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { useDecisions } from "../hooks/use-decisions";
import { DecisionCard } from "./decision-card";
import { CreateDecisionDialog } from "./create-decision-dialog";
import { DecisionSearch } from "./decision-search";
import { DecisionStats } from "./decision-stats";

export function DecisionList() {
  const {
    decisions,
    isLoading,
    refetch,
  } = useDecisions();

  const [search, setSearch] = useState("");

  const filteredDecisions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return decisions;
    }

    return decisions.filter((decision) =>
      decision.title
        .toLowerCase()
        .includes(query)
    );
  }, [decisions, search]);

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
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border bg-muted/40"
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:max-w-md" />

          <div className="h-10 w-full animate-pulse rounded-lg bg-muted md:w-40" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border bg-muted/40"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DecisionStats
        decisions={decisions.length}
        options={totalOptions}
        criteria={totalCriteria}
      />

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <DecisionSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <CreateDecisionDialog onCreated={refetch} />
      </div>

      {search.trim() && decisions.length > 0 && (
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

      {decisions.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card px-6 py-14 text-center sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Plus className="size-6 text-primary" />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-tight">
            No decisions yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Start by creating your first decision.
            Add the options you are considering and the
            criteria that matter most.
          </p>

          <div className="mt-6 flex justify-center">
            <CreateDecisionDialog onCreated={refetch} />
          </div>
        </div>
      ) : filteredDecisions.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card px-6 py-14 text-center sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
            <FileSearch className="size-6 text-muted-foreground" />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-tight">
            No matching decisions
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Nothing matches{" "}
            <span className="font-medium text-foreground">
              “{search.trim()}”
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
          {filteredDecisions.map((decision) => (
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