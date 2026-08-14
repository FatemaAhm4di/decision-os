"use client";

import {
  FolderKanban,
  ListTodo,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";

import {
  useDecisionForm,
  type DecisionOption,
  type DecisionCriterion,
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
  const {
    title,
    setTitle,

    options,
    criteria,

    isLoading,
    error,

    roundedTotalWeight,
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
    onCreated,
  });

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    await submit();
  }

  return (
    <Card className="mt-8 overflow-hidden rounded-2xl border shadow-sm">
      <CardHeader className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10">
            <FolderKanban className="size-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {mode === "edit"
                ? "Edit Decision"
                : "Create New Decision"}
            </CardTitle>

            <CardDescription className="mt-1.5 max-w-2xl">
              {mode === "edit"
                ? "Update your decision, options, and weighted criteria."
                : "Compare different options using weighted criteria to make a better decision."}
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
          {/* Decision title */}
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
              placeholder="e.g. Choose a new laptop"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          <Separator />

          {/* Options */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ListTodo className="size-5 text-primary" />
                </div>

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
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={option.id}
                  className="group flex items-center gap-2"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </div>

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
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeOption(option.id)
                    }
                    disabled={
                      isLoading || options.length <= 1
                    }
                    aria-label={`Remove option ${index + 1}`}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Criteria */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <SlidersHorizontal className="size-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Criteria
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Define what matters and assign its weight.
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
                <Plus className="size-4" />
                Add Criterion
              </Button>
            </div>

            <div className="space-y-3">
              {criteria.map((criterion, index) => (
                <div
                  key={criterion.id}
                  className="grid gap-2 sm:grid-cols-[1fr_120px_auto]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </div>

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
                    />
                  </div>

                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={criterion.weight}
                    onChange={(event) =>
                      updateCriterion(
                        criterion.id,
                        "weight",
                        Number(event.target.value)
                      )
                    }
                    disabled={isLoading}
                    aria-label={`${criterion.name || `Criterion ${index + 1}`} weight`}
                    className="h-11"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeCriterion(criterion.id)
                    }
                    disabled={
                      isLoading || criteria.length <= 1
                    }
                    aria-label={`Remove criterion ${index + 1}`}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Weight summary */}
            <div
              className={[
                "flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
                isWeightValid
                  ? "border-primary/20 bg-primary/[0.04]"
                  : "border-destructive/20 bg-destructive/[0.04]",
              ].join(" ")}
            >
              <div>
                <p className="text-sm font-medium">
                  Total weight
                </p>

                <p className="text-xs text-muted-foreground">
                  All criterion weights must add up to 1.
                </p>
              </div>

              <div
                className={[
                  "text-lg font-bold",
                  isWeightValid
                    ? "text-primary"
                    : "text-destructive",
                ].join(" ")}
              >
                {roundedTotalWeight.toFixed(2)} / 1.00
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/[0.05] px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
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