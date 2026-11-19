
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

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

  async function handleDuplicate() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/decision/${decisionId}/duplicate`,
        {
          method: "POST",
        }
      );

      const data = (await response.json().catch(() => null)) as
        | DuplicateResponse
        | null;

      if (!response.ok || !data?.decision?.id) {
        throw new Error(
          data?.error || "Failed to duplicate decision."
        );
      }

      toast.success("Decision duplicated successfully.");

      router.push(`/decision/${data.decision.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to duplicate decision:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
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
  );
}
