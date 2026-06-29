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
  options: Option[];
  criteria: Criterion[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDecisionPage({
  params,
}: Props) {
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/decision/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <div>Decision not found.</div>;
  }

  const decision: Decision = await res.json();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">
        Edit Decision
      </h1>

      <div className="rounded-lg border p-4">
        <p>
          <strong>Title:</strong>{" "}
          {decision.title}
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
              className="rounded border p-3"
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
              className="rounded border p-3"
            >
              {criterion.name} ({criterion.weight})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}