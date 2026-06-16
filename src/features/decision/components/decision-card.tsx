type DecisionCardProps = {
  decision: {
    id: string;
    title: string;
    createdAt: string;
  };
};

export function DecisionCard({
  decision,
}: DecisionCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="text-lg font-semibold">
        {decision.title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {new Date(decision.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}