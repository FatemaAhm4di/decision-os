
import {
  BarChart3,
  CheckCircle2,
  Trophy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type AnalysisScore = {
  criterionId: string;
  value: number;
};

type AnalysisOption = {
  id: string;
  name: string;
  scores: AnalysisScore[];
};

type AnalysisCriterion = {
  id: string;
  name: string;
  weight: number;
};

type AnalysisResult = {
  optionId: string;
  name: string;
  score: number;
};

type DecisionAnalysisProps = {
  options: AnalysisOption[];
  criteria: AnalysisCriterion[];
  results: AnalysisResult[];
};

function formatScore(value: number) {
  return Number(value.toFixed(2)).toString();
}

export function DecisionAnalysis({
  options,
  criteria,
  results,
}: DecisionAnalysisProps) {
  if (results.length === 0 || criteria.length === 0) {
    return null;
  }

  const highestScore = results[0].score;
  const lowestScore = results[results.length - 1].score;

  const totalWeight = criteria.reduce(
    (total, criterion) => total + criterion.weight,
    0
  );

  const topOptions = results.filter(
    (result) => result.score === highestScore
  );

  const isTie = topOptions.length > 1;

  const optionById = new Map(
    options.map((option) => [option.id, option])
  );

  const contributions = criteria.map((criterion) => {
    const rows = results.map((result) => {
      const option = optionById.get(result.optionId);

      const score = option?.scores.find(
        (item) => item.criterionId === criterion.id
      );

      const contribution =
        score && totalWeight > 0
          ? score.value * (criterion.weight / totalWeight)
          : 0;

      return {
        optionId: result.optionId,
        optionName: result.name,
        rawScore: score?.value ?? null,
        contribution,
      };
    });

    return { criterion, rows };
  });

  const scoreGap = Number(
    (highestScore - lowestScore).toFixed(2)
  );

  return (
    <section
      className="space-y-6"
      aria-labelledby="analysis-title"
    >
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <BarChart3
            className="size-4"
            aria-hidden="true"
          />
          Decision insights
        </div>

        <h2
          id="analysis-title"
          className="mt-2 text-2xl font-bold tracking-tight text-foreground"
        >
          Analysis
        </h2>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Compare your options and understand how each weighted
          criterion contributes to the final result.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              {isTie ? "Highest score" : "Winning score"}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {formatScore(highestScore)}
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                / 10
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Score spread
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {formatScore(scoreGap)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Difference between the highest and lowest scores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Options compared
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {results.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {isTie && (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <Trophy
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />

          <div>
            <p className="font-medium text-foreground">
              The top result is a tie
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {topOptions.map((option) => option.name).join(", ")}{" "}
              share the highest score. Compare their individual
              criteria before making your final choice.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Score comparison</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {results.map((result, index) => {
            const percentage = Math.max(
              0,
              Math.min(100, (result.score / 10) * 100)
            );

            const difference = Number(
              (highestScore - result.score).toFixed(2)
            );

            return (
              <div
                key={result.optionId}
                className="space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {index === 0 && (
                      <CheckCircle2
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                    )}

                    <span className="truncate text-sm font-medium text-foreground">
                      {result.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {formatScore(result.score)} / 10
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={`${result.name} score`}
                  aria-valuemin={0}
                  aria-valuemax={10}
                  aria-valuenow={result.score}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {index > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {difference === 0
                      ? "Tied for the highest score"
                      : `${formatScore(difference)} points behind the highest score`}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criterion breakdown</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {contributions.map(({ criterion, rows }) => {
            const maxContribution = Math.max(
              0,
              ...rows.map((row) => row.contribution)
            );

            return (
              <div
                key={criterion.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground">
                    {criterion.name}
                  </h3>

                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Weight:{" "}
                    {formatScore(criterion.weight * 100)}%
                  </span>
                </div>

                <div className="space-y-4">
                  {rows.map((row) => {
                    const percentage =
                      maxContribution > 0
                        ? (row.contribution / maxContribution) *
                          100
                        : 0;

                    return (
                      <div
                        key={row.optionId}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate text-muted-foreground">
                            {row.optionName}
                          </span>

                          <span className="shrink-0 text-right tabular-nums text-foreground">
                            {row.rawScore === null
                              ? "Not scored"
                              : `${formatScore(row.rawScore)} raw · ${formatScore(row.contribution)} weighted`}
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-[width] duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="text-xs leading-5 text-muted-foreground">
            Weighted contribution = score × normalized criterion
            weight. The contributions add up to each option&apos;s
            final score when the criteria weights sum to 1.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
