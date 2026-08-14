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
  /*
   * OPTIONS
   */

  // Update existing options
  for (const option of data.options) {
    const exists =
      existingDecision.options.find(
        (item) => item.id === option.id
      );

    if (exists) {
      const name = option.name.trim();

      if (name !== "") {
        await tx.option.update({
          where: {
            id: option.id,
          },
          data: {
            name,
          },
        });
      }
    }
  }

  // Create new options
  for (const option of data.options) {
    const exists =
      existingDecision.options.find(
        (item) => item.id === option.id
      );

    if (!exists && option.name.trim() !== "") {
      await tx.option.create({
        data: {
          name: option.name.trim(),
          decisionId,
        },
      });
    }
  }

  // Delete removed options
  for (const option of existingDecision.options) {
    const stillExists = data.options.some(
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

  /*
   * CRITERIA
   */

  // Update existing criteria
  for (const criterion of data.criteria) {
    const exists =
      existingDecision.criteria.find(
        (item) => item.id === criterion.id
      );

    if (exists) {
      const name = criterion.name.trim();

      if (name !== "") {
        await tx.criterion.update({
          where: {
            id: criterion.id,
          },
          data: {
            name,
            weight: criterion.weight,
          },
        });
      }
    }
  }

  // Create new criteria
  for (const criterion of data.criteria) {
    const exists =
      existingDecision.criteria.find(
        (item) => item.id === criterion.id
      );

    if (
      !exists &&
      criterion.name.trim() !== ""
    ) {
      await tx.criterion.create({
        data: {
          name: criterion.name.trim(),
          weight: criterion.weight,
          decisionId,
        },
      });
    }
  }

  // Delete removed criteria
  for (const criterion of existingDecision.criteria) {
    const stillExists = data.criteria.some(
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
}