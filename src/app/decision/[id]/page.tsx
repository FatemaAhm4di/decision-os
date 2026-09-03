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

  const decision = await getDecision(id);

  if (!decision) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-xl">
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
            <div className="rounded-full bg-destructive/10 p-3">
              <CircleAlert className="size-6 text-destructive" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold">
              Decision not found
            </h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              The decision you are looking for does not
              exist or may have been removed.
            </p>

            <Link href="/decision" className="mt-6">
              <Button>
                <ArrowLeft className="mr-2 size-4" />
                Create a decision
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const expectedScoreCount =
    decision.options.length *
    decision.criteria.length;

  const actualScoreCount =
    decision.options.reduce(
      (total, option) =>
        total + option.scores.length,
      0
    );

  const hasCompleteScores =
    expectedScoreCount > 0 &&
    actualScoreCount === expectedScoreCount;

  const results = hasCompleteScores
    ? calculateDecision(decision)
    : [];

  const winner = results[0] ?? null;

  const createdAt = new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(decision.createdAt));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="group inline-flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
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

      <div className="mb-10">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10 transition-transform duration-300 hover:scale-105">
            <Trophy className="size-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
              {decision.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              <span>Created {createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {winner && (
        <Card className="mb-8 overflow-hidden border-primary/20 bg-primary/[0.03] transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                  <Trophy className="size-4 shrink-0" />
                  Recommended option
                </div>

                <h2 className="break-words text-2xl font-bold sm:text-3xl">
                  {winner.name}
                </h2>

                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Based on the weighted criteria and
                  scores you provided.
                </p>
              </div>

              <div className="shrink-0 rounded-xl border bg-background px-6 py-4 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Score
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {winner.score}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="size-5 text-primary" />
              Options
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {decision.options.length > 0 ? (
                decision.options.map((option) => (
                  <div
                    key={option.id}
                    className="rounded-xl border bg-muted/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50"
                  >
                    <p className="break-words font-medium">
                      {option.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No options added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" />
              Criteria
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {decision.criteria.length > 0 ? (
                decision.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50"
                  >
                    <span className="min-w-0 break-words font-medium">
                      {criterion.name}
                    </span>

                    <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                      {criterion.weight}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No criteria added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
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

      <Card className="mt-6 overflow-hidden">
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
                  className="flex items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      #{index + 1}
                    </span>

                    <span className="truncate font-medium">
                      {result.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-lg font-bold">
                    {result.score}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center">
              <p className="font-medium">
                Complete the score matrix
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Rate every option for every criterion
                to see the final ranking.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}