
"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";

type DeleteDecisionButtonProps = {
  decisionId: string;
  onDeleted: () => void;
};

export function DeleteDecisionButton({
  decisionId,
  onDeleted,
}: DeleteDecisionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this decision?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/decision/${decisionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message ?? "Failed to delete decision."
        );
      }

      toast.success("Decision deleted successfully.");

      onDeleted();
    } catch (error) {
      console.error("Failed to delete decision:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete decision."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full sm:w-auto"
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
  );
}
