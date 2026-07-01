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
    return <div>Decision not found.</div>;
  }

  const decision: Decision = await res.json();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Decision
      </h1>

      <CreateDecisionForm
        mode="edit"
        decisionId={decision.id}
        initialTitle={decision.title}
        initialOptions={decision.options}
        initialCriteria={decision.criteria}
      />
    </div>
  );
}