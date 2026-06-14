import { Decision } from "@/types/decision";

type DecisionCardProps = {
  decision: Decision;
};

export function DecisionCard({
  decision,
}: DecisionCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">
        {decision.title}
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        ID: {decision.id}
      </p>

      <div className="mt-4 flex gap-4 text-sm">
        <span>
          Options: {decision.options.length}
        </span>

        <span>
          Criteria: {decision.criteria.length}
        </span>
      </div>
    </div>
  );
}