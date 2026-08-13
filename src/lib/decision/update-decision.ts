import { prisma } from "@/lib/prisma";
import { validateCriteriaWeights } from "@/lib/validation/decision";

type OptionInput = {
  id?: string;
  name: string;
};

type CriterionInput = {
  id?: string;
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
  const title = data.title?.trim();

  if (!title) {
    throw new Error("Decision title is required");
  }

  const options = data.options
    .map((option) => ({
      ...option,
      name: option.name.trim(),
    }))
    .filter((option) => option.name.length > 0);

  const criteria = data.criteria
    .map((criterion) => ({
      ...criterion,
      name: criterion.name.trim(),
    }))
    .filter((criterion) => criterion.name.length > 0);

  if (options.length === 0) {
    throw new Error("At least one option is required");
  }

  if (criteria.length === 0) {
    throw new Error("At least one criterion is required");
  }

  validateCriteriaWeights(criteria);

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
        title,
      },
    });

    const existingOptionIds = new Set(
      existingDecision.options.map(
        (option) => option.id
      )
    );

    const incomingOptionIds = new Set(
      options
        .map((option) => option.id)
        .filter(
          (id): id is string =>
            typeof id === "string"
        )
    );

    for (const option of options) {
      if (
        option.id &&
        existingOptionIds.has(option.id)
      ) {
        await tx.option.update({
          where: {
            id: option.id,
          },
          data: {
            name: option.name,
          },
        });
      } else {
        await tx.option.create({
          data: {
            name: option.name,
            decisionId,
          },
        });
      }
    }

    const removedOptions =
      existingDecision.options.filter(
        (option) =>
          !incomingOptionIds.has(option.id)
      );

    for (const option of removedOptions) {
      await tx.score.deleteMany({
        where: {
          optionId: option.id,
        },
      });

      await tx.option.delete({
        where: {
          id: option.id,
        },
      });
    }

    const existingCriterionIds = new Set(
      existingDecision.criteria.map(
        (criterion) => criterion.id
      )
    );

    const incomingCriterionIds = new Set(
      criteria
        .map((criterion) => criterion.id)
        .filter(
          (id): id is string =>
            typeof id === "string"
        )
    );

    for (const criterion of criteria) {
      if (
        criterion.id &&
        existingCriterionIds.has(
          criterion.id
        )
      ) {
        await tx.criterion.update({
          where: {
            id: criterion.id,
          },
          data: {
            name: criterion.name,
            weight: criterion.weight,
          },
        });
      } else {
        await tx.criterion.create({
          data: {
            name: criterion.name,
            weight: criterion.weight,
            decisionId,
          },
        });
      }
    }

    const removedCriteria =
      existingDecision.criteria.filter(
        (criterion) =>
          !incomingCriterionIds.has(
            criterion.id
          )
      );

    for (const criterion of removedCriteria) {
      await tx.score.deleteMany({
        where: {
          criterionId: criterion.id,
        },
      });

      await tx.criterion.delete({
        where: {
          id: criterion.id,
        },
      });
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