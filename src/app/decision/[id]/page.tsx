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

import { ScoreMatrix } from "@/features/decision/components/score-matrix";
import { calculateDecision } from "@/lib/engine/calculate";
import { getDecision } from "@/lib/decision/get-decision";

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
            Something went wrong while loading this decision.
            Please try again.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/decision" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
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
            The decision you are looking for does not exist or
            may have been removed.
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

  const expectedScoreCount =
    decision.options.length * decision.criteria.length;

  const actualScoreCount = decision.options.reduce(
    (total, option) => total + option.scores.length,
    0
  );

  const hasCompleteScores =
    expectedScoreCount > 0 &&
    actualScoreCount === expectedScoreCount;

  const hasOptions = decision.options.length > 0;
  const hasCriteria = decision.criteria.length > 0;

  const results = hasCompleteScores
    ? calculateDecision(decision)
    : [];

  const winner = results[0] ?? null;

  const createdAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(decision.createdAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/decision"
          className="group inline-flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to decisions
        </Link>

        <Link href={`/decision/${decision.id}/edit`}>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Pencil className="mr-2 size-4" />
            Edit Decision
          </Button>
        </Link>
      </div>

      {/* Decision heading */}
      <section>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 sm:size-14">
            <Trophy className="size-6 sm:size-7" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {decision.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              <span>Created {createdAt}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Setup warning */}
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
                Add at least one option and one criterion before
                entering scores.
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

      {/* Recommended option */}
      {winner && (
        <Card className="overflow-hidden border-primary/20 bg-primary/[0.03]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                  <Trophy className="size-4 shrink-0" />
                  Recommended option
                </div>

                <h2 className="break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {winner.name}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Based on the weighted criteria and scores you
                  provided.
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-border bg-background px-6 py-4 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Score
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  {winner.score}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Options and criteria */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="size-5 text-primary" />
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
                    Add options before you can compare this
                    decision.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" />
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
                    Add criteria and assign weights before
                    scoring this decision.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score matrix */}
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

      {/* Results */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            Results
          </CardTitle>
        </CardHeader>

        <CardContent>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={result.optionId}
                  className={[
                    "flex items-center justify-between gap-4 rounded-xl",
                    "border border-border p-4 transition-colors",
                    "hover:bg-muted/40",
                    index === 0
                      ? "border-primary/20 bg-primary/[0.03]"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={[
                        "flex size-8 shrink-0 items-center justify-center",
                        "rounded-full text-sm font-bold",
                        index === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary",
                      ].join(" ")}
                    >
                      #{index + 1}
                    </span>

                    <span className="truncate font-medium text-foreground">
                      {result.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-lg font-bold text-foreground">
                    {result.score}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
              <p className="font-medium text-foreground">
                {hasOptions && hasCriteria
                  ? "Complete the score matrix"
                  : "Complete your decision setup"}
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {hasOptions && hasCriteria
                  ? "Rate every option for every criterion to see the final ranking."
                  : "Add at least one option and one criterion before scoring this decision."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
