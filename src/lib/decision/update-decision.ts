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

    // Create new options
for (const option of data.options) {
  const exists = existingDecision.options.find(
    (item) => item.id === option.id
  );

  if (!exists && option.name.trim() !== "") {
    await tx.option.create({
      data: {
        name: option.name,
        decisionId,
      },
    });
  }
}

// Delete removed options
for (const option of existingDecision.options) {
  const stillExists = data.options.find(
    (item) => item.id === option.id
  );

  if (!stillExists) {
    await tx.option.delete({
      where: {
        id: option.id,
      },
    });
  }
}

// Update existing criteria
for (const criterion of data.criteria) {
  const exists = existingDecision.criteria.find(
    (item) => item.id === criterion.id
  );

  if (exists) {
    await tx.criterion.update({
      where: {
        id: criterion.id,
      },
      data: {
        name: criterion.name,
        weight: criterion.weight,
      },
    });
  }
}

// Create new criteria
for (const criterion of data.criteria) {
  const exists = existingDecision.criteria.find(
    (item) => item.id === criterion.id
  );

  if (!exists && criterion.name.trim() !== "") {
    await tx.criterion.create({
      data: {
        name: criterion.name,
        weight: criterion.weight,
        decisionId,
      },
    });
  }
}

// Delete removed criteria
for (const criterion of existingDecision.criteria) {
  const stillExists = data.criteria.find(
    (item) => item.id === criterion.id
  );

  if (!stillExists) {
    await tx.criterion.delete({
      where: {
        id: criterion.id,
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