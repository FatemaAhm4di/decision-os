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

  const decision = await res.json();

  return (
    <div className="space-y-6 p-6">
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
          {decision.options.map(
            (option: { id: string; name: string }) => (
              <li
                key={option.id}
                className="rounded-lg border p-3"
              >
                {option.name}
              </li>
            )
          )}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Criteria
        </h2>

        <ul className="space-y-2">
          {decision.criteria.map(
            (
              criterion: {
                id: string;
                name: string;
                weight: number;
              }
            ) => (
              <li
                key={criterion.id}
                className="rounded-lg border p-3"
              >
                {criterion.name} ({criterion.weight})
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}