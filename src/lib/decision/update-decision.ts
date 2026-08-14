import { prisma } from "@/lib/prisma";
import { validateCriteriaWeights } from "@/lib/validation/decision";

import { syncDecisionItems } from "./sync-decision-items";

export type OptionInput = {
  id: string;
  name: string;
};

export type CriterionInput = {
  id: string;
  name: string;
  weight: number;
};

export type UpdateDecisionInput = {
  title: string;
  options: OptionInput[];
  criteria: CriterionInput[];
};

export async function updateDecision(
  decisionId: string,
  data: UpdateDecisionInput
) {
  validateCriteriaWeights(data.criteria);

  return prisma.$transaction(async (tx) => {
    const existingDecision =
      await tx.decision.findUnique({
        where: {
          id: decisionId,
        },
        include: {
          options: true,
          criteria: true,
        },
      });

    if (!existingDecision) {
      throw new Error("Decision not found");
    }

    const title = data.title.trim();

    if (!title) {
      throw new Error(
        "Decision title is required"
      );
    }

    await tx.decision.update({
      where: {
        id: decisionId,
      },
      data: {
        title,
      },
    });

    await syncDecisionItems(
      tx,
      decisionId,
      existingDecision,
      data
    );

    return tx.decision.findUnique({
      where: {
        id: decisionId,
      },
      include: {
        options: {
          include: {
            scores: true,
          },
        },
        criteria: true,
      },
    });
  });
}