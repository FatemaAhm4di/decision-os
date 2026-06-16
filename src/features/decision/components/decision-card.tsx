import { Decision } from "@/types/decision";

type DecisionCardProps = {
  decision: Decision;
};

export function DecisionCard({
  decision,
}: DecisionCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="text-lg font-semibold">
        {decision.title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {new Date(decision.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-4 flex gap-4 text-sm text-gray-600">
        <span>
          Options: {decision.options?.length ?? 0}
        </span>

        <span>
          Criteria: {decision.criteria?.length ?? 0}
        </span>
      </div>
    </div>
  );
}