import { CreateDecisionForm } from "@/features/decision/components/create-decision-form";

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
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <h1 className="text-xl font-semibold">
            Decision not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The decision you are looking for does not exist
            or may have been removed.
          </p>
        </div>
      </main>
    );
  }

  const decision: Decision = await res.json();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">
          Decision Management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Edit Decision
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update the title, options, and weighted criteria
          for this decision.
        </p>
      </div>

      <CreateDecisionForm
        mode="edit"
        decisionId={decision.id}
        initialTitle={decision.title}
        initialOptions={decision.options.map(
          ({ id, name }) => ({
            id,
            name,
          })
        )}
        initialCriteria={decision.criteria}
      />
    </main>
  );
}
