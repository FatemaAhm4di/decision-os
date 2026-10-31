"use client";

import { useState } from "react";

import {
  CheckCircle2,
  CircleDashed,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

type DecisionStatusButtonProps = {
  decisionId: string;
  isCompleted: boolean;
  onUpdated: () => void;
};

export function DecisionStatusButton({
  decisionId,
  isCompleted,
  onUpdated,
}: DecisionStatusButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange() {
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
            isCompleted: !isCompleted,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Failed to update decision status."
        );
      }

      onUpdated();
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
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUpdating}
        onClick={handleStatusChange}
        className="w-full sm:w-auto"
      >
        {isUpdating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isCompleted ? (
          <CircleDashed className="size-4" />
        ) : (
          <CheckCircle2 className="size-4" />
        )}

        {isUpdating
          ? "Updating..."
          : isCompleted
            ? "Reopen decision"
            : "Mark as completed"}
      </Button>

      {error && (
        <p
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}