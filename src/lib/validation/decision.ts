
type CriterionWeight = {
  weight: number;
};

export function validateCriteriaWeights(
  criteria: CriterionWeight[]
): void {
  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("At least one criterion is required.");
  }

  const hasInvalidWeight = criteria.some(
    (criterion) =>
      !criterion ||
      typeof criterion.weight !== "number" ||
      !Number.isFinite(criterion.weight) ||
      criterion.weight < 0 ||
      criterion.weight > 1
  );

  if (hasInvalidWeight) {
    throw new Error(
      "Each criterion weight must be a valid number between 0 and 1."
    );
  }

  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  if (Math.abs(totalWeight - 1) > 0.001) {
    throw new Error(
      `Criteria weights must sum to 1. Current total: ${totalWeight.toFixed(2)}`
    );
  }
}
