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
        include: {
          options: true,
          criteria: true,
        },
      });

    if (!existingDecision) {
      throw new Error("Decision not found");
    }

    await tx.decision.update({
      where: {
        id: decisionId,
      },
      data: {
        title: data.title,
      },
    });

    // Update existing options
    for (const option of data.options) {
      const exists = existingDecision.options.find(
        (item) => item.id === option.id
      );

      if (exists) {
        await tx.option.update({
          where: {
            id: option.id,
          },
          data: {
            name: option.name,
          },
        });
      }
    }

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