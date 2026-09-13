"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Check,
  Loader2,
  Save,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Score = {
  id: string;
  value: number;
  criterionId: string;
};

type Option = {
  id: string;
  name: string;
  scores: Score[];
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Props = {
  decisionId: string;
  options: Option[];
  criteria: Criterion[];
};

type ScoreMap = Record<string, number>;

export function ScoreMatrix({
  decisionId,
  options,
  criteria,
}: Props) {
  const router = useRouter();

  const initialScores = useMemo<ScoreMap>(() => {
    const result: ScoreMap = {};

    options.forEach((option) => {
      option.scores.forEach((score) => {
        result[`${option.id}:${score.criterionId}`] = score.value;
      });
    });

    return result;
  }, [options]);

  const [scores, setScores] = useState<ScoreMap>(initialScores);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    optionId: string,
    criterionId: string,
    value: string
  ) {
    const key = `${optionId}:${criterionId}`;

    if (value === "") {
      setScores((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      setIsSaved(false);
      setError(null);
      return;
    }

    const numericValue = Number(value);

    if (
      !Number.isFinite(numericValue) ||
      numericValue < 0 ||
      numericValue > 10
    ) {
      return;
    }

    setScores((prev) => ({
      ...prev,
      [key]: numericValue,
    }));

    setIsSaved(false);
    setError(null);
  }

  function hasMissingScores() {
    return options.some((option) =>
      criteria.some(
        (criterion) =>
          scores[`${option.id}:${criterion.id}`] === undefined
      )
    );
  }

  async function saveScores() {
    if (hasMissingScores()) {
      setError(
        "Please rate every option for every criterion before saving."
      );
      setIsSaved(false);
      return;
    }

    setIsSaving(true);
    setIsSaved(false);
    setError(null);

    try {
      const payload = options.flatMap((option) =>
        criteria.map((criterion) => {
          const key = `${option.id}:${criterion.id}`;

          return {
            optionId: option.id,
            criterionId: criterion.id,
            value: scores[key],
          };
        })
      );

      const response = await fetch(
        `/api/decision/${decisionId}/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Failed to save scores"
        );
      }

      setIsSaved(true);
      router.refresh();
    } catch (error) {
      console.error("Failed to save scores:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save scores. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (options.length === 0 || criteria.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-center sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <SlidersHorizontal className="size-5 text-primary" />
        </div>

        <h3 className="mt-4 font-semibold">
          Nothing to score yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add at least one option and one criterion before
          entering scores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b">
                <th className="sticky left-0 z-10 min-w-44 border-r bg-muted/40 px-4 py-4 text-left font-semibold">
                  Option
                </th>

                {criteria.map((criterion) => (
                  <th
                    key={criterion.id}
                    className="min-w-36 px-4 py-4 text-left"
                  >
                    <div className="space-y-1">
                      <p className="break-words font-semibold">
                        {criterion.name}
                      </p>

                      <p className="text-xs font-normal text-muted-foreground">
                        Weight: {criterion.weight}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {options.map((option) => (
                <tr
                  key={option.id}
                  className="border-b transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="sticky left-0 z-10 border-r bg-background px-4 py-4">
                    <span className="break-words font-medium">
                      {option.name}
                    </span>
                  </td>

                  {criteria.map((criterion) => {
                    const key = `${option.id}:${criterion.id}`;

                    return (
                      <td
                        key={criterion.id}
                        className="px-4 py-4"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            inputMode="numeric"
                            value={scores[key] ?? ""}
                            onChange={(event) =>
                              handleChange(
                                option.id,
                                criterion.id,
                                event.target.value
                              )
                            }
                            disabled={isSaving}
                            aria-label={`${option.name} score for ${criterion.name}`}
                            className="h-10 w-20 text-center font-medium"
                          />

                          <span className="text-xs text-muted-foreground">
                            / 10
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {options.map((option) => (
          <section
            key={option.id}
            className="overflow-hidden rounded-2xl border bg-card"
            aria-labelledby={`option-${option.id}`}
          >
            <div className="border-b bg-muted/30 px-4 py-4">
              <h3
                id={`option-${option.id}`}
                className="break-words text-base font-semibold text-foreground"
              >
                {option.name}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Rate this option for each criterion
              </p>
            </div>

            <div className="divide-y">
              {criteria.map((criterion) => {
                const key = `${option.id}:${criterion.id}`;

                return (
                  <div
                    key={criterion.id}
                    className="flex items-center justify-between gap-4 px-4 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-medium text-foreground">
                        {criterion.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Weight: {criterion.weight}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        inputMode="numeric"
                        value={scores[key] ?? ""}
                        onChange={(event) =>
                          handleChange(
                            option.id,
                            criterion.id,
                            event.target.value
                          )
                        }
                        disabled={isSaving}
                        aria-label={`${option.name} score for ${criterion.name}`}
                        className="h-10 w-16 text-center font-medium"
                      />

                      <span className="text-xs text-muted-foreground">
                        / 10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Status + Save */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-5 text-sm">
          {error && (
            <p className="leading-5 text-destructive">
              {error}
            </p>
          )}

          {isSaved && !error && (
            <p className="flex items-center gap-1.5 text-primary">
              <Check className="size-4 shrink-0" />
              Scores saved successfully.
            </p>
          )}

          {!isSaved && !error && (
            <p className="text-muted-foreground">
              Rate each option from 0 to 10.
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={saveScores}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : isSaved ? (
            <>
              <Check className="size-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Scores
            </>
          )}
        </Button>
      </div>
    </div>
  );
}