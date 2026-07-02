import { prisma } from "@/lib/prisma";

type OptionInput = {
  id: string;
  name: string;
};

type CriterionInput = {
  id: string;
  name: string;
  weight: number;
};

type UpdateDecisionInput = {
  title: string;
  options: OptionInput[];
  criteria: CriterionInput[];
};

export async function updateDecision(
  decisionId: string,
  data: UpdateDecisionInput
) {
  return prisma.$transaction(async (tx) => {
    const existingDecision =
      await tx.decision.findUnique({
        where: {
          id: decisionId,
        },
      });

    if (!existingDecision) {
      throw new Error("Decision not found");
    }

    const updatedDecision =
      await tx.decision.update({
        where: {
          id: decisionId,
        },
        data: {
          title: data.title,
        },
        include: {
          options: true,
          criteria: true,
        },
      });

    return updatedDecision;
  });
}