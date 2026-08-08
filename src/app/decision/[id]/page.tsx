import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ListTodo,
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

type Decision = {
  id: string;
  title: string;
  createdAt: string;
  options: Option[];
  criteria: Criterion[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DecisionPage({
  params,
}: PageProps) {
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/decision/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-xl">
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
            <div className="rounded-full bg-destructive/10 p-3">
              <CheckCircle2 className="size-6 text-destructive" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold">
              Decision not found
            </h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              The decision you are looking for does not
              exist or may have been removed.
            </p>

            <Link href="/" className="mt-6">
              <Button>
                <ArrowLeft className="mr-2 size-4" />
                Back to decisions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const decision: Decision = await res.json();

  const results = calculateDecision(decision);
  const winner = results[0] ?? null;

  const createdAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(decision.createdAt));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to decisions
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10">
            <CheckCircle2 className="size-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {decision.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />

              <span>Created {createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended option */}
      {winner && (
        <Card className="mb-8 overflow-hidden border-primary/20 bg-primary/[0.03]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                  <Trophy className="size-4" />
                  Recommended option
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  {winner.name}
                </h2>

                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Based on the weighted criteria and
                  scores you provided.
                </p>
              </div>

              <div className="rounded-xl border bg-background px-6 py-4 text-center shadow-sm">
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

      {/* Options & Criteria */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="size-5 text-primary" />
              Options
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {decision.options.map((option) => (
                <div
                  key={option.id}
                  className="rounded-xl border bg-muted/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50"
                >
                  <p className="font-medium">
                    {option.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" />
              Criteria
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {decision.criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50"
                >
                  <span className="min-w-0 font-medium">
                    {criterion.name}
                  </span>

                  <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                    {criterion.weight}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scores */}
      <Card className="mt-6">
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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            Results
          </CardTitle>
        </CardHeader>

        <CardContent>
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
        </CardContent>
      </Card>
    </main>
  );
}