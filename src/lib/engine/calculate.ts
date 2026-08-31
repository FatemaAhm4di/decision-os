
type Score = {
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
  weight: number;
};

type Decision = {
  options: Option[];
  criteria: Criterion[];
};

export type DecisionResult = {
  optionId: string;
  name: string;
  score: number;
};

export function calculateDecision(
  decision: Decision
): DecisionResult[] {
  if (
    decision.options.length === 0 ||
    decision.criteria.length === 0
  ) {
    return [];
  }

  const totalWeight = decision.criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  if (totalWeight <= 0) {
    return decision.options.map((option) => ({
      optionId: option.id,
      name: option.name,
      score: 0,
    }));
  }

  const criteriaMap = new Map(
    decision.criteria.map((criterion) => [
      criterion.id,
      criterion,
    ])
  );

  return decision.options
    .map((option) => {
      const score = option.scores.reduce(
        (total, currentScore) => {
          const criterion = criteriaMap.get(
            currentScore.criterionId
          );

          if (!criterion) {
            return total;
          }

          const normalizedWeight =
            criterion.weight / totalWeight;

          return (
            total +
            currentScore.value * normalizedWeight
          );
        },
        0
      );

      return {
        optionId: option.id,
        name: option.name,
        score: Number(score.toFixed(2)),
      };
    })
    .sort((a, b) => b.score - a.score);
}
