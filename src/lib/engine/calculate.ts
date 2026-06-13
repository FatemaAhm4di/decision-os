import { Decision } from "@/types/decision";

export function calculateDecision(decision: Decision) {
  return decision.options
    .map((option) => {
      const score = decision.criteria.reduce((sum, criterion) => {
        const value = option.scores[criterion.id] ?? 0;

        return sum + value * criterion.weight;
      }, 0);

      return {
        optionId: option.id,
        name: option.name,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);
}