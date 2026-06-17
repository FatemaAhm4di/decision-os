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

export function calculateDecision(
  decision: Decision
) {
  return decision.options
    .map((option) => {
      const score = option.scores.reduce(
        (sum, currentScore) => {
          const criterion =
            decision.criteria.find(
              (item) =>
                item.id === currentScore.criterionId
            );

          if (!criterion) {
            return sum;
          }

          return (
            sum +
            currentScore.value * criterion.weight
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