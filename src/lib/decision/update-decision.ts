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

function validateUpdateInput(data: UpdateDecisionInput) {
  if (
    !data ||
    typeof data !== "object" ||
    typeof data.title !== "string"
  ) {
    throw new Error("Invalid decision data");
  }

  if (!Array.isArray(data.options)) {
    throw new Error("Options must be an array");
  }

  if (!Array.isArray(data.criteria)) {
    throw new Error("Criteria must be an array");
  }

  const title = data.title.trim();

  if (!title) {
    throw new Error("Decision title is required");
  }

  const options = data.options.map((option) => {
    if (
      !option ||
      typeof option.id !== "string" ||
      typeof option.name !== "string"
    ) {
      throw new Error("Invalid option data");
    }

    return {
      id: option.id,
      name: option.name.trim(),
    };
  });

  const criteria = data.criteria.map((criterion) => {
    if (
      !criterion ||
      typeof criterion.id !== "string" ||
      typeof criterion.name !== "string" ||
      typeof criterion.weight !== "number"
    ) {
      throw new Error("Invalid criterion data");
    }

    return {
      id: criterion.id,
      name: criterion.name.trim(),
      weight: criterion.weight,
    };
  });

  if (options.length === 0) {
    throw new Error("At least one option is required");
  }

  if (options.some((option) => !option.name)) {
    throw new Error("Each option must have a name");
  }

  if (criteria.length === 0) {
    throw new Error("At least one criterion is required");
  }

  if (criteria.some((criterion) => !criterion.name)) {
    throw new Error("Each criterion must have a name");
  }

  const optionIds = options.map((option) => option.id);
  const criterionIds = criteria.map((criterion) => criterion.id);

  if (new Set(optionIds).size !== optionIds.length) {
    throw new Error("Duplicate option IDs are not allowed");
  }

  if (
    new Set(criterionIds).size !== criterionIds.length
  ) {
    throw new Error("Duplicate criterion IDs are not allowed");
  }

  validateCriteriaWeights(criteria);

  return {
    title,
    options,
    criteria,
  };
}

export async function updateDecision(
  decisionId: string,
  data: UpdateDecisionInput
) {
  const validatedData = validateUpdateInput(data);

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
        title: validatedData.title,
      },
    });

    await syncDecisionItems(
      tx,
      decisionId,
      existingDecision,
      validatedData
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