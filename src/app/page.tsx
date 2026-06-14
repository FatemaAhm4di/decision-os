import { CreateDecisionForm } from "@/features/decision/components/create-decision-form";
import { DecisionList } from "@/features/decision/components/decision-list";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-4xl font-bold">Decision OS</h1>

      <p className="mt-2 text-gray-500">
        Make better decisions with weighted analysis.
      </p>

<CreateDecisionForm />

<DecisionList />    </main>
  );
}