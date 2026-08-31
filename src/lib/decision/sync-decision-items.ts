
import { Prisma } from "@prisma/client";

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

type ExistingDecision = {
  options: {
    id: string;
    name: string;
  }[];

  criteria: {
    id: string;
    name: string;
    weight: number;
  }[];
};

export async function syncDecisionItems(
  tx: Prisma.TransactionClient,
  decisionId: string,
  existingDecision: ExistingDecision,
  data: UpdateDecisionInput
) {
  const existingOptionIds = new Set(
    existingDecision.options.map((option) => option.id)
  );

  const existingCriterionIds = new Set(
    existingDecision.criteria.map(
      (criterion) => criterion.id
    )
  );

  const incomingOptionIds = new Set<string>();
  const incomingCriterionIds = new Set<string>();

  for (const option of data.options) {
    const name = option.name.trim();

    if (!name) {
      continue;
    }

    if (option.id) {
      incomingOptionIds.add(option.id);
    }

    if (existingOptionIds.has(option.id)) {
      await tx.option.update({
        where: {
          id: option.id,
        },
        data: {
          name,
        },
      });
    } else {
      await tx.option.create({
        data: {
          name,
          decisionId,
        },
      });
    }
  }

  for (const option of existingDecision.options) {
    if (!incomingOptionIds.has(option.id)) {
      await tx.option.delete({
        where: {
          id: option.id,
        },
      });
    }
  }

  for (const criterion of data.criteria) {
    const name = criterion.name.trim();

    if (!name) {
      continue;
    }

    if (criterion.id) {
      incomingCriterionIds.add(criterion.id);
    }

    if (existingCriterionIds.has(criterion.id)) {
      await tx.criterion.update({
        where: {
          id: criterion.id,
        },
        data: {
          name,
          weight: criterion.weight,
        },
      });
    } else {
      await tx.criterion.create({
        data: {
          name,
          weight: criterion.weight,
          decisionId,
        },
      });
    }
  }

  for (const criterion of existingDecision.criteria) {
    if (!incomingCriterionIds.has(criterion.id)) {
      await tx.criterion.delete({
        where: {
          id: criterion.id,
        },
      });
    }
  }
}