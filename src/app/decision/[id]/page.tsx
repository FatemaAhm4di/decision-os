
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  ListTodo,
  Pencil,
  SlidersHorizontal,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { DecisionAnalysis } from "@/features/decision/components/decision-analysis";
import { DecisionNotes } from "@/features/decision/components/decision-notes";
import { DuplicateDecisionButton } from "@/features/decision/components/duplicate-decision-button";
import { ExportDecisionButton } from "@/features/decision/components/export-decision-button";
import { ScoreMatrix } from "@/features/decision/components/score-matrix";

import { getDecision } from "@/lib/decision/get-decision";
import { calculateDecision } from "@/lib/engine/calculate";

type Decision = NonNullable<
  Awaited<ReturnType<typeof getDecision>>
>;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DecisionPage({
  params,
}: PageProps) {
  const { id } = await params;

  let decision: Decision | null = null;

  try {
    decision = await getDecision(id);
  } catch (error) {
    console.error("Failed to load decision:", error);

    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <CircleAlert
              className="size-6 text-destructive"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            Unable to load decision
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Something went wrong while loading this decision. Please try again.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/decision" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 size-4" />
                Back to decisions
              </Button>
            </Link>

            <Link href={`/decision/${id}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Try again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!decision) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <CircleAlert
              className="size-6 text-destructive"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            Decision not found
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            The decision you are looking for does not exist or may have been removed.
          </p>

          <Link href="/decision" className="mt-6">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Back to decisions
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const hasOptions = decision.options.length > 0;
  const hasCriteria = decision.criteria.length > 0;

  const expectedScoreCount =
    decision.options.length * decision.criteria.length;

  const hasCompleteScores =
    expectedScoreCount > 0 &&
    decision.options.every((option) => {
      const criterionIds = option.scores.map(
        (score) => score.criterionId
      );

      return (
        option.scores.length === decision.criteria.length &&
        new Set(criterionIds).size === decision.criteria.length &&
        decision.criteria.every((criterion) =>
          option.scores.some(
            (score) =>
              score.criterionId === criterion.id &&
              Number.isFinite(score.value) &&
              score.value >= 0 &&
              score.value <= 10
          )
        )
      );
    });

  const results =
    hasCompleteScores && hasOptions && hasCriteria
      ? calculateDecision(decision)
      : [];

  const winner = results[0] ?? null;

  const isTie =
    winner !== null &&
    results.filter(
      (result) => result.score === winner.score
    ).length > 1;

  const createdAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(decision.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/decision"
          className="group inline-flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to decisions
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row">
          <ExportDecisionButton
            title={decision.title}
            status={decision.status}
            createdAt={new Date(decision.createdAt).toISOString()}
            updatedAt={new Date(decision.updatedAt).toISOString()}
            options={decision.options}
            criteria={decision.criteria}
            results={results}
          />

          <DuplicateDecisionButton decisionId={decision.id} />

          <Link href={`/decision/${decision.id}/edit`}>
            <Button variant="outline" className="w-full sm:w-auto">
              <Pencil className="mr-2 size-4" />
              Edit Decision
            </Button>
          </Link>
        </div>
      </div>

      <section>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 sm:size-14">
            <Trophy
              className="size-6 sm:size-7"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {decision.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays
                className="size-4 shrink-0"
                aria-hidden="true"
              />
              <span>Created {createdAt}</span>
            </div>
          </div>
        </div>
      </section>

      {(!hasOptions || !hasCriteria) && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-5">
            <CircleAlert
              className="mt-0.5 size-5 shrink-0 text-destructive"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <h2 className="font-semibold text-foreground">
                This decision is not ready to score
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Add at least one option and one criterion before entering scores.
              </p>

              <Link
                href={`/decision/${decision.id}/edit`}
                className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Edit decision
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {winner && (
        <Card className="overflow-hidden border-primary/20 bg-primary/[0.03]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                  <Trophy
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {isTie ? "Top-ranked options" : "Recommended option"}
                </div>

                <h2 className="break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {isTie
                    ? results
                        .filter(
                          (result) => result.score === winner.score
                        )
                        .map((result) => result.name)
                        .join(" · ")
                    : winner.name}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {isTie
                    ? "These options share the highest weighted score. Compare their individual criteria before making your final choice."
                    : "Based on the weighted criteria and scores you provided."}
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-border bg-background px-6 py-4 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {isTie ? "Top score" : "Score"}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  {winner.score}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    / 10
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo
                className="size-5 text-primary"
                aria-hidden="true"
              />
              Options
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {hasOptions ? (
                decision.options.map((option) => (
                  <div
                    key={option.id}
                    className="rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                  >
                    <p className="break-words font-medium text-foreground">
                      {option.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
                  <p className="font-medium text-foreground">
                    No options added yet.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Add options before you can compare this decision.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal
                className="size-5 text-primary"
                aria-hidden="true"
              />
              Criteria
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {hasCriteria ? (
                decision.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0 break-words font-medium text-foreground">
                      {criterion.name}
                    </span>

                    <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                      {criterion.weight}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
                  <p className="font-medium text-foreground">
                    No criteria added yet.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Add criteria and assign weights before scoring this decision.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Scores</CardTitle>
        </CardHeader>

        <CardContent>
          <ScoreMatrix
            decisionId={decision.id}
            options={decision.options}
            criteria={decision.criteria}
          />
        </CardContent>
      </Card>

      <DecisionNotes
  key={decision.id}
  decisionId={decision.id}
  initialNotes={decision.notes ?? ""}
/>

      {results.length > 0 ? (
        <DecisionAnalysis
          options={decision.options}
          criteria={decision.criteria}
          results={results}
        />
      ) : (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy
                className="size-5 text-primary"
                aria-hidden="true"
              />
              Analysis
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
              <p className="font-medium text-foreground">
                {hasOptions && hasCriteria
                  ? "Complete the score matrix"
                  : "Complete your decision setup"}
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {hasOptions && hasCriteria
                  ? "Rate every option against every criterion to unlock the ranking and detailed analysis."
                  : "Add at least one option and one criterion before scoring this decision."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
