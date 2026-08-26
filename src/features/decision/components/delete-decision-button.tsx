"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

type Props = {
  decisionId: string;
};

export function DeleteDecisionButton({
  decisionId,
}: Props) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this decision? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/decision/${decisionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res
        .json()
        .catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message ??
            "Failed to delete decision"
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to delete decision:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete this decision."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete decision"
      >
        {isDeleting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="size-4" />
            Delete
          </>
        )}
      </Button>

      {error && (
        <p
          role="alert"
          className="max-w-xs text-right text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}