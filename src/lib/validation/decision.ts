export function validateCriteriaWeights(
  criteria: { weight: number }[]
) {
  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  if (Math.abs(totalWeight - 1) > 0.001) {
    throw new Error(
      `Criteria weights must sum to 1. Current total: ${totalWeight}`
    );
  }
}