"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderKanban,
  ListTodo,
  Plus,
  SlidersHorizontal,
  Trash2,
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

import {
  useDecisionForm,
  type DecisionCriterion,
  type DecisionOption,
} from "../hooks/use-decision-form";

type Props = {
  onCreated?: () => void;
  initialTitle?: string;
  initialOptions?: DecisionOption[];
  initialCriteria?: DecisionCriterion[];
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
  const router = useRouter();

  const {
    title,
    setTitle,
    options,
    criteria,
    isLoading,
    error,
    totalWeight,
    isWeightValid,
    addOption,
    removeOption,
    updateOption,
    addCriterion,
    removeCriterion,
    updateCriterion,
    submit,
  } = useDecisionForm({
    initialTitle,
    initialOptions,
    initialCriteria,
    mode,
    decisionId,
    onCreated: () => {
      onCreated?.();

      if (!onCreated) {
        router.push("/");
        router.refresh();
      }
    },
  });

  function handleBackToHome() {
    if (isLoading) {
      return;
    }

    router.push("/");
  }

  return (
    <Card className="mt-8 overflow-hidden rounded-2xl">
      <CardHeader className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10">
            <FolderKanban
              className="size-6 text-primary"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-2xl tracking-tight sm:text-3xl">
              {mode === "edit"
                ? "Edit Decision"
                : "Create New Decision"}
            </CardTitle>

            <CardDescription className="mt-2 max-w-xl">
              {mode === "edit"
                ? "Update your decision, options, and weighted criteria."
                : "Compare your options using weighted criteria to make a better decision."}
            </CardDescription>
          </div>
        </div>

        <Separator />
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="space-y-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Decision Title</Label>

            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Which laptop should I buy?"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          <Separator />

          <section
            aria-labelledby="options-heading"
            className="space-y-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ListTodo
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h2
                    id="options-heading"
                    className="font-semibold"
                  >
                    Options
                  </h2>

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
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 size-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2"
                >
                  <span className="hidden w-6 shrink-0 text-sm text-muted-foreground sm:block">
                    {index + 1}.
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
                    className="h-11"
                    aria-label={`Option ${index + 1}`}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    disabled={
                      isLoading || options.length === 1
                    }
                    aria-label={`Remove option ${index + 1}`}
                    className="shrink-0 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section
            aria-labelledby="criteria-heading"
            className="space-y-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <SlidersHorizontal
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h2
                    id="criteria-heading"
                    className="font-semibold"
                  >
                    Criteria
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Define what matters and assign each
                    criterion a weight.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCriterion}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 size-4" />
                Add Criterion
              </Button>
            </div>

            <div className="space-y-3">
              {criteria.map((criterion, index) => (
                <div
                  key={criterion.id}
                  className="flex flex-col gap-2 rounded-xl border border-border p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="hidden w-6 shrink-0 text-sm text-muted-foreground sm:block">
                      {index + 1}.
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
                      className="h-11"
                      aria-label={`Criterion ${index + 1}`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-28 sm:flex-none">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={criterion.weight}
                        onChange={(event) =>
                          updateCriterion(
                            criterion.id,
                            "weight",
                            Number(event.target.value)
                          )
                        }
                        disabled={isLoading}
                        aria-label={`Weight for ${
                          criterion.name ||
                          `criterion ${index + 1}`
                        }`}
                        className="h-11 pr-12"
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        weight
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeCriterion(criterion.id)
                      }
                      disabled={
                        isLoading || criteria.length === 1
                      }
                      aria-label={`Remove criterion ${
                        index + 1
                      }`}
                      className="shrink-0 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={[
                "flex flex-col gap-1 rounded-xl border p-4",
                "sm:flex-row sm:items-center sm:justify-between",
                isWeightValid
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5",
              ].join(" ")}
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Total weight
                </p>

                <p className="text-xs text-muted-foreground">
                  All criteria weights must add up to 1.
                </p>
              </div>

              <span
                className={[
                  "text-lg font-bold",
                  isWeightValid
                    ? "text-primary"
                    : "text-destructive",
                ].join(" ")}
              >
                {totalWeight.toFixed(1)} / 1.0
              </span>
            </div>
          </section>

          <Separator />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleBackToHome}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto sm:min-w-40"
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