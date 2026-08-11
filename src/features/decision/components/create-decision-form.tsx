"use client";

import { useMemo, useState } from "react";
import {
  FolderKanban,
  ListTodo,
  Minus,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type Option = {
  id: string;
  name: string;
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Props = {
  onCreated?: () => void;
  initialTitle?: string;
  initialOptions?: Option[];
  initialCriteria?: Criterion[];
  mode?: "create" | "edit";
  decisionId?: string;
};

export function CreateDecisionForm({
  onCreated,
  initialTitle = "",
  initialOptions,
  initialCriteria,
  mode = "create",
  decisionId,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  const [options, setOptions] = useState<Option[]>(
    initialOptions ?? [
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]
  );

  const [criteria, setCriteria] = useState<Criterion[]>(
    initialCriteria ?? [
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalWeight = useMemo(
    () =>
      criteria.reduce(
        (sum, criterion) => sum + criterion.weight,
        0
      ),
    [criteria]
  );

  const roundedTotalWeight = Number(
    totalWeight.toFixed(2)
  );

  const isWeightValid =
    Math.abs(roundedTotalWeight - 1) <= 0.001;

  const hasValidOptions = options.some(
    (option) => option.name.trim().length > 0
  );

  const hasValidCriteria = criteria.some(
    (criterion) =>
      criterion.name.trim().length > 0
  );

  function addOption() {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]);

    setError(null);
  }

  function removeOption(id: string) {
    if (options.length <= 1) {
      setError("At least one option is required.");
      return;
    }

    setOptions((prev) =>
      prev.filter((option) => option.id !== id)
    );

    setError(null);
  }

  function updateOption(
    id: string,
    name: string
  ) {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id
          ? {
              ...option,
              name,
            }
          : option
      )
    );

    setError(null);
  }

  function addCriterion() {
    setCriteria((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 0,
      },
    ]);

    setError(null);
  }

  function removeCriterion(id: string) {
    if (criteria.length <= 1) {
      setError(
        "At least one criterion is required."
      );
      return;
    }

    setCriteria((prev) =>
      prev.filter(
        (criterion) => criterion.id !== id
      )
    );

    setError(null);
  }

  function updateCriterion(
    id: string,
    field: "name" | "weight",
    value: string | number
  ) {
    setCriteria((prev) =>
      prev.map((criterion) =>
        criterion.id === id
          ? {
              ...criterion,
              [field]: value,
            }
          : criterion
      )
    );

    setError(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(
        "Please enter a decision title."
      );
      return;
    }

    if (!hasValidOptions) {
      setError(
        "Add at least one option."
      );
      return;
    }

    if (!hasValidCriteria) {
      setError(
        "Add at least one criterion."
      );
      return;
    }

    const hasInvalidWeight = criteria.some(
      (criterion) =>
        !Number.isFinite(criterion.weight) ||
        criterion.weight < 0 ||
        criterion.weight > 1
    );

    if (hasInvalidWeight) {
      setError(
        "Each criterion weight must be between 0 and 1."
      );
      return;
    }

    if (!isWeightValid) {
      setError(
        `Criteria weights must equal 1. Current total: ${roundedTotalWeight}`
      );
      return;
    }

    const validOptions = options.filter(
      (option) => option.name.trim()
    );

    const validCriteria = criteria.filter(
      (criterion) =>
        criterion.name.trim()
    );

    setIsLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/decision/${decisionId}`
          : "/api/decision";

      const method =
        mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          options: validOptions.map(
            (option) => ({
              id: option.id,
              name: option.name.trim(),
            })
          ),
          criteria: validCriteria.map(
            (criterion) => ({
              id: criterion.id,
              name: criterion.name.trim(),
              weight: Number(
                criterion.weight.toFixed(2)
              ),
            })
          ),
        }),
      });

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => null);

        throw new Error(
          data?.message ??
            "Request failed"
        );
      }

      await res.json();

      if (mode === "create") {
        setTitle("");

        setOptions([
          {
            id: crypto.randomUUID(),
            name: "",
          },
        ]);

        setCriteria([
          {
            id: crypto.randomUUID(),
            name: "",
            weight: 1,
          },
        ]);
      }

      onCreated?.();
    } catch (error) {
      console.error(
        "Failed to save decision:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mt-8 overflow-hidden rounded-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10">
            <FolderKanban className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl sm:text-2xl">
              {mode === "edit"
                ? "Edit Decision"
                : "Create New Decision"}
            </CardTitle>

            <CardDescription className="mt-1">
              {mode === "edit"
                ? "Update your decision and its criteria."
                : "Compare options using weighted criteria."}
            </CardDescription>
          </div>
        </div>

        <Separator />
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="space-y-2">
            <Label htmlFor="decision-title">
              Decision Title
            </Label>

            <Input
              id="decision-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Which laptop should I buy?"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="size-5 text-primary" />

                <div>
                  <h3 className="font-semibold">
                    Options
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Add the choices you want to compare.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={isLoading}
              >
                <Plus className="size-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map(
                (option, index) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-2"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>

                    <Input
                      value={option.name}
                      onChange={(event) =>
                        updateOption(
                          option.id,
                          event.target.value
                        )
                      }
                      placeholder={`Option ${index + 1}`}
                      disabled={isLoading}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeOption(option.id)
                      }
                      disabled={
                        isLoading ||
                        options.length <= 1
                      }
                      aria-label={`Remove option ${index + 1}`}
                    >
                      <Minus className="size-4" />
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" />

                <div>
                  <h3 className="font-semibold">
                    Criteria
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Set the importance of each criterion.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCriterion}
                disabled={isLoading}
              >
                <Plus className="size-4" />
                Add Criterion
              </Button>
            </div>

            <div className="space-y-3">
              {criteria.map(
                (criterion, index) => (
                  <div
                    key={criterion.id}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>

                    <Input
                      value={criterion.name}
                      onChange={(event) =>
                        updateCriterion(
                          criterion.id,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder={`Criterion ${index + 1}`}
                      disabled={isLoading}
                    />

                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        inputMode="decimal"
                        value={criterion.weight}
                        onChange={(event) =>
                          updateCriterion(
                            criterion.id,
                            "weight",
                            Number(
                              event.target.value
                            )
                          )
                        }
                        aria-label={`Weight for ${criterion.name || `criterion ${index + 1}`}`}
                        className="w-24 text-center"
                        disabled={isLoading}
                      />

                      <span className="text-xs text-muted-foreground">
                        / 1
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeCriterion(
                          criterion.id
                        )
                      }
                      disabled={
                        isLoading ||
                        criteria.length <= 1
                      }
                      aria-label={`Remove criterion ${index + 1}`}
                    >
                      <Minus className="size-4" />
                    </Button>
                  </div>
                )
              )}
            </div>

            <div
              className={`flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                isWeightValid
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5"
              }`}
            >
              <div>
                <p className="text-sm font-medium">
                  Total Weight
                </p>

                <p className="text-xs text-muted-foreground">
                  All criteria weights must add up to exactly 1.
                </p>
              </div>

              <span
                className={`text-lg font-bold ${
                  isWeightValid
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {roundedTotalWeight.toFixed(2)} / 1.00
              </span>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end border-t pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading
                ? mode === "edit"
                  ? "Saving..."
                  : "Creating..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Create Decision"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}