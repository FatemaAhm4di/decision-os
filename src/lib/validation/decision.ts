
export function validateCriteriaWeights(
  criteria: { weight: number }[]
) {
  if (criteria.length === 0) {
    return;
  }

  const hasInvalidWeight = criteria.some(
    (criterion) =>
      !Number.isFinite(criterion.weight) ||
      criterion.weight < 0
  );

  if (hasInvalidWeight) {
    throw new Error(
      "Criteria weights must be valid non-negative numbers"
    );
  }

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
