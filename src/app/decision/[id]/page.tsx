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
    return <div>Decision not found</div>;
  }

  const decision: Decision = await res.json();

  const results = calculateDecision(decision);
  

  const winner = results[0] ?? null;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          {decision.title}
        </h1>

        <p className="text-sm text-gray-500">
          {new Date(
            decision.createdAt
          ).toLocaleDateString()}
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Options
        </h2>

        <ul className="space-y-2">
          {decision.options.map((option) => (
            <li
              key={option.id}
              className="rounded-lg border p-3"
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Criteria
        </h2>

        <ul className="space-y-2">
          {decision.criteria.map((criterion) => (
            <li
              key={criterion.id}
              className="rounded-lg border p-3"
            >
              {criterion.name} ({criterion.weight})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Scores
        </h2>

        <ScoreMatrix
  decisionId={decision.id}
  options={decision.options}
  criteria={decision.criteria}
/>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Results
        </h2>

        {winner && (
          <div className="mb-4 rounded-xl border border-green-500 bg-green-50 p-4">
            <p className="text-sm text-gray-600">
              Recommended option
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              {winner.name}
            </h3>

            <p className="mt-1 text-lg">
              Score: {winner.score}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={result.optionId}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <span className="font-medium">
                #{index + 1} {result.name}
              </span>

              <span className="text-lg font-bold">
                {result.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}