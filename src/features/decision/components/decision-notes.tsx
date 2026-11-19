
"use client";

import { useState, type ChangeEvent } from "react";
import {
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type DecisionNotesProps = {
  decisionId: string;
  initialNotes: string;
};

type SaveStatus = "idle" | "saving";

const MAX_NOTES_LENGTH = 10000;

export function DecisionNotes({
  decisionId,
  initialNotes,
}: DecisionNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const isDirty = notes !== savedNotes;

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNotes(event.target.value);
  };

  const handleSave = async () => {
    if (!isDirty || status === "saving") return;

    setStatus("saving");

    try {
      const response = await fetch(
        `/api/decision/${decisionId}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Failed to save decision notes."
        );
      }

      const updatedNotes =
        typeof data?.notes === "string" ? data.notes : notes;

      setNotes(updatedNotes);
      setSavedNotes(updatedNotes);

      toast.success("Notes saved successfully.");
    } catch (error) {
      console.error("Failed to save decision notes:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving notes."
      );
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <FileText
            className="size-5 text-primary"
            aria-hidden="true"
          />
          Decision Notes
        </CardTitle>

        <span className="text-xs font-medium text-muted-foreground">
          {notes.length.toLocaleString()} /{" "}
          {MAX_NOTES_LENGTH.toLocaleString()}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="decision-notes"
            className="text-sm font-medium text-foreground"
          >
            Your thoughts and reasoning
          </label>

          <textarea
            id="decision-notes"
            value={notes}
            onChange={handleChange}
            maxLength={MAX_NOTES_LENGTH}
            rows={7}
            disabled={status === "saving"}
            placeholder="Write down your thoughts, reasons, concerns, risks, or anything you want to remember about this decision..."
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="min-h-5 text-sm"
            aria-live="polite"
          >
            {status === "saving" && (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Saving changes...
              </span>
            )}

            {status === "idle" && isDirty && (
              <span className="text-muted-foreground">
                You have unsaved changes.
              </span>
            )}

            {status === "idle" && !isDirty && (
              <span className="text-muted-foreground">
                Your notes are up to date.
              </span>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || status === "saving"}
            className="w-full sm:w-auto"
          >
            {status === "saving" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
