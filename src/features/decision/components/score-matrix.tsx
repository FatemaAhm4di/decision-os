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

export function ScoreMatrix({
  decisionId,
  options,
  criteria,
}: Props) {
  const router = useRouter();

  const initialScores = useMemo(() => {
    const result: Record<string, number> = {};

    options.forEach((option) => {
      option.scores.forEach((score) => {
        result[`${option.id}:${score.criterionId}`] =
          score.value;
      });
    });

    return result;
  }, [options]);

  const [scores, setScores] =
    useState<Record<string, number>>(initialScores);

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
      Number.isNaN(numericValue) ||
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

  async function saveScores() {
    setIsSaving(true);
    setIsSaved(false);
    setError(null);

    try {
      const payload = options.flatMap((option) =>
        criteria
          .map((criterion) => {
            const key = `${option.id}:${criterion.id}`;
            const value = scores[key];

            if (value === undefined) {
              return null;
            }

            return {
              optionId: option.id,
              criterionId: criterion.id,
              value,
            };
          })
          .filter(
            (
              score
            ): score is {
              optionId: string;
              criterionId: string;
              value: number;
            } => score !== null
          )
      );

      const res = await fetch(
        `/api/decision/${decisionId}/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save scores");
      }

      setIsSaved(true);
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Unable to save scores. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (options.length === 0 || criteria.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <SlidersHorizontal className="size-5 text-primary" />
        </div>

        <h3 className="mt-4 font-semibold">
          Nothing to score yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add at least one option and one criterion
          before entering scores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-muted/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="sticky left-0 z-10 min-w-[180px] border-r bg-muted/40 px-4 py-4 text-left text-sm font-semibold">
                  Option
                </th>

                {criteria.map((criterion) => (
                  <th
                    key={criterion.id}
                    className="min-w-[150px] px-4 py-4 text-left"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
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
                  className="border-b last:border-b-0 transition-colors hover:bg-muted/20"
                >
                  <td className="sticky left-0 z-10 border-r bg-background px-4 py-4">
                    <span className="font-medium">
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-5 text-sm">
          {error && (
            <p className="text-destructive">
              {error}
            </p>
          )}

          {isSaved && !error && (
            <p className="flex items-center gap-1.5 text-sm text-primary">
              <Check className="size-4" />
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