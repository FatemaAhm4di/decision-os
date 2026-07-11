"use client";

import { useDecisions } from "../hooks/use-decisions";

import { DecisionCard } from "./decision-card";
import { CreateDecisionDialog } from "./create-decision-dialog";

export function DecisionList() {
  const {
    decisions,
    isLoading,
    refetch,
  } = useDecisions();

  if (isLoading) {
    return (
      <p className="mt-8">
        Loading...
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <CreateDecisionDialog
          onCreated={refetch}
        />
      </div>

      {decisions.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="text-xl font-semibold">
            No decisions yet
          </h3>

          <p className="mt-2 text-muted-foreground">
            Create your first decision
            to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {decisions.map((decision) => (
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