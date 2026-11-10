
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type DecisionNotesProps = {
  decisionId: string;
};

type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

const MAX_NOTES_LENGTH = 10000;

export function DecisionNotes({ decisionId }: DecisionNotesProps) {
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const isDirty = notes !== savedNotes;

  const fetchNotes = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/decision/${decisionId}/notes`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load decision notes."
        );
      }

      const loadedNotes =
        typeof data.notes === "string" ? data.notes : "";

      setNotes(loadedNotes);
      setSavedNotes(loadedNotes);
      setStatus("idle");
    } catch (error) {
      console.error("Failed to load decision notes:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading notes."
      );

      setStatus("error");
    }
  }, [decisionId]);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  const handleSave = async () => {
    if (!isDirty || status === "saving") return;

    setStatus("saving");
    setErrorMessage("");

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save decision notes."
        );
      }

      const updatedNotes =
        typeof data.notes === "string" ? data.notes : notes;

      setNotes(updatedNotes);
      setSavedNotes(updatedNotes);
      setStatus("saved");
    } catch (error) {
      console.error("Failed to save decision notes:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving notes."
      );

      setStatus("error");
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNotes(event.target.value);

    if (status === "saved" || status === "error") {
      setStatus("idle");
      setErrorMessage("");
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
        {status === "loading" ? (
          <div
            className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground"
            role="status"
          >
            <Loader2 className="size-4 animate-spin" />
            Loading notes...
          </div>
        ) : (
          <>
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
                placeholder="Write down your thoughts, reasons, concerns, risks, or anything you want to remember about this decision..."
                rows={7}
                disabled={status === "error" && !savedNotes && !notes}
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                className="min-h-5 text-sm"
                aria-live="polite"
              >
                {status === "saved" && (
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="size-4" />
                    Notes saved successfully.
                  </span>
                )}

                {status === "error" && (
                  <span className="inline-flex items-start gap-1.5 text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    {errorMessage}
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

                {status === "saving" && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Saving changes...
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {status === "error" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchNotes}
                    className="w-full sm:w-auto"
                  >
                    Retry loading
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    !isDirty ||
                    status === "saving" ||
                    status === "loading"
                  }
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
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
