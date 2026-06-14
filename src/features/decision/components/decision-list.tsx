"use client";

import { useDecisions } from "../hooks/use-decisions";
import { DecisionCard } from "./decision-card";
import { CreateDecisionForm } from "./create-decision-form";

export function DecisionList() {
  const { decisions, isLoading, refetch } = useDecisions();

  if (isLoading) {
    return <p className="mt-8">Loading...</p>;
  }

  if (decisions.length === 0) {
    return (
      <div>
        <CreateDecisionForm onCreated={refetch} />
        <p className="mt-8">No decisions yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <CreateDecisionForm onCreated={refetch} />

      {decisions.map((decision) => (
        <DecisionCard key={decision.id} decision={decision} />
      ))}
    </div>
  );
}