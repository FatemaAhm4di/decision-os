"use client";

import { Button } from "@/components/ui/Button";

type Props = {
  decisionId: string;
};

export function DeleteDecisionButton({
  decisionId,
}: Props) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this decision?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/decision/${decisionId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to delete decision"
        );
      }

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}