"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import type { DecisionStatus } from "@/types/decision";

type DecisionStatusButtonProps = {
  decisionId: string;
  status: DecisionStatus;
  onUpdated: () => void | Promise<void>;
};

const statusOptions: {
  value: DecisionStatus;
  label: string;
}[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function DecisionStatusButton({
  decisionId,
  status,
  onUpdated,
}: DecisionStatusButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(
    nextStatus: DecisionStatus
  ) {
    if (nextStatus === status || isUpdating) {
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/decision/${decisionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Failed to update decision status."
        );
      }

      await onUpdated();
    } catch (error) {
      console.error("Failed to update decision status:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="relative w-full sm:w-auto">
        {isUpdating && (
          <Loader2
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}

        <label htmlFor={`status-${decisionId}`} className="sr-only">
          Decision status
        </label>

        <select
          id={`status-${decisionId}`}
          value={status}
          disabled={isUpdating}
          onChange={(event) =>
            void handleStatusChange(
              event.target.value as DecisionStatus
            )
          }
          className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-medium text-foreground outline-none transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-44"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}