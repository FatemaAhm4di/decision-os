
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";

type DuplicateDecisionButtonProps = {
  decisionId: string;
};

type DuplicateResponse = {
  decision?: {
    id: string;
  };
  error?: string;
};

export function DuplicateDecisionButton({
  decisionId,
}: DuplicateDecisionButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDuplicate() {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/decision/${decisionId}/duplicate`,
        {
          method: "POST",
        }
      );

      const data =
        (await response.json()) as DuplicateResponse;

      if (!response.ok || !data.decision?.id) {
        throw new Error(
          data.error || "Failed to duplicate decision."
        );
      }

      router.push(`/decision/${data.decision.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleDuplicate}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderCircle
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Copy
            className="mr-2 size-4"
            aria-hidden="true"
          />
        )}

        {isLoading ? "Duplicating..." : "Duplicate"}
      </Button>

      {error && (
        <p
          role="alert"
          className="max-w-xs text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
