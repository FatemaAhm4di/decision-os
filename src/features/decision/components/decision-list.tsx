"use client";

import { useMemo, useState } from "react";

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
    return decisions.filter((decision) =>
      decision.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [decisions, search]);

  if (isLoading) {
    return (
      <p className="mt-8">
        Loading...
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <DecisionStats
        decisions={decisions.length}
        options={decisions.reduce(
          (total, decision) =>
            total + (decision.options?.length ?? 0),
          0
        )}
        criteria={decisions.reduce(
          (total, decision) =>
            total + (decision.criteria?.length ?? 0),
          0
        )}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <DecisionSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <CreateDecisionDialog
          onCreated={refetch}
        />
      </div>

      {filteredDecisions.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="text-xl font-semibold">
            {search
              ? "No matching decisions"
              : "No decisions yet"}
          </h3>

          <p className="mt-2 text-muted-foreground">
            {search
              ? "Try another search keyword."
              : "Create your first decision to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
            />
          ))}
        </div>
      )}
    </div>
  );
}