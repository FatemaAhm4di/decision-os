
import { CreateDecisionForm } from "@/features/decision/components/create-decision-form";
import { decisionTemplates } from "@/data/decision-templates";

type NewDecisionPageProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

export default async function NewDecisionPage({
  searchParams,
}: NewDecisionPageProps) {
  const { template: templateId } = await searchParams;

  const template = decisionTemplates.find(
    (item) => item.id === templateId,
  );

  const initialOptions = template?.options.map((name, index) => ({
    id: `${template.id}-option-${index + 1}`,
    name,
  }));

  const initialCriteria = template?.criteria.map((criterion, index) => ({
    id: `${template.id}-criterion-${index + 1}`,
    name: criterion.name,
    weight: criterion.weight,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <CreateDecisionForm
        initialTitle={template?.title ?? ""}
        initialOptions={initialOptions}
        initialCriteria={initialCriteria}
      />
    </main>
  );
}
