"use client";

import { useMemo, useState } from "react";

export type DecisionOption = {
  id: string;
  name: string;
};

export type DecisionCriterion = {
  id: string;
  name: string;
  weight: number;
};

type UseDecisionFormProps = {
  initialTitle?: string;
  initialOptions?: DecisionOption[];
  initialCriteria?: DecisionCriterion[];
  mode?: "create" | "edit";
  decisionId?: string;
  onCreated?: () => void;
};

export function useDecisionForm({
  initialTitle = "",
  initialOptions,
  initialCriteria,
  mode = "create",
  decisionId,
  onCreated,
}: UseDecisionFormProps) {
  const [title, setTitle] = useState(initialTitle);

  const [options, setOptions] = useState<
    DecisionOption[]
  >(
    initialOptions ?? [
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]
  );

  const [criteria, setCriteria] = useState<
    DecisionCriterion[]
  >(
    initialCriteria ?? [
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  const totalWeight = useMemo(
    () =>
      criteria.reduce(
        (sum, criterion) =>
          sum + criterion.weight,
        0
      ),
    [criteria]
  );

  const roundedTotalWeight = Number(
    totalWeight.toFixed(2)
  );

  const isWeightValid =
    Math.abs(roundedTotalWeight - 1) <= 0.001;

  const hasValidOptions = options.some(
    (option) => option.name.trim().length > 0
  );

  const hasValidCriteria = criteria.some(
    (criterion) =>
      criterion.name.trim().length > 0
  );

  function clearError() {
    setError(null);
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]);

    clearError();
  }

  function removeOption(id: string) {
    if (options.length <= 1) {
      setError(
        "At least one option is required."
      );
      return;
    }

    setOptions((prev) =>
      prev.filter((option) => option.id !== id)
    );

    clearError();
  }

  function updateOption(
    id: string,
    name: string
  ) {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id
          ? {
              ...option,
              name,
            }
          : option
      )
    );

    clearError();
  }

  function addCriterion() {
    setCriteria((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 0,
      },
    ]);

    clearError();
  }

  function removeCriterion(id: string) {
    if (criteria.length <= 1) {
      setError(
        "At least one criterion is required."
      );
      return;
    }

    setCriteria((prev) =>
      prev.filter(
        (criterion) => criterion.id !== id
      )
    );

    clearError();
  }

  function updateCriterion(
    id: string,
    field: "name" | "weight",
    value: string | number
  ) {
    setCriteria((prev) =>
      prev.map((criterion) =>
        criterion.id === id
          ? {
              ...criterion,
              [field]: value,
            }
          : criterion
      )
    );

    clearError();
  }

  function validateForm() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(
        "Please enter a decision title."
      );
      return null;
    }

    if (!hasValidOptions) {
      setError("Add at least one option.");
      return null;
    }

    if (!hasValidCriteria) {
      setError(
        "Add at least one criterion."
      );
      return null;
    }

    const hasInvalidWeight = criteria.some(
      (criterion) =>
        !Number.isFinite(criterion.weight) ||
        criterion.weight < 0 ||
        criterion.weight > 1
    );

    if (hasInvalidWeight) {
      setError(
        "Each criterion weight must be between 0 and 1."
      );
      return null;
    }

    if (!isWeightValid) {
      setError(
        `Criteria weights must equal 1. Current total: ${roundedTotalWeight}`
      );
      return null;
    }

    return {
      title: trimmedTitle,
      options: options
        .filter(
          (option) => option.name.trim()
        )
        .map((option) => ({
          id: option.id,
          name: option.name.trim(),
        })),
      criteria: criteria
        .filter(
          (criterion) =>
            criterion.name.trim()
        )
        .map((criterion) => ({
          id: criterion.id,
          name: criterion.name.trim(),
          weight: Number(
            criterion.weight.toFixed(2)
          ),
        })),
    };
  }

  async function submit() {
    const payload = validateForm();

    if (!payload) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url =
        mode === "edit"
          ? `/api/decision/${decisionId}`
          : "/api/decision";

      const method =
        mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ??
            "Unable to save decision."
        );
      }

      if (mode === "create") {
        resetForm();
      }

      onCreated?.();
    } catch (error) {
      console.error(
        "Failed to save decision:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setTitle("");

    setOptions([
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]);

    setCriteria([
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]);
  }

  return {
    title,
    setTitle,

    options,
    criteria,

    isLoading,
    error,

    totalWeight,
    roundedTotalWeight,
    isWeightValid,

    addOption,
    removeOption,
    updateOption,

    addCriterion,
    removeCriterion,
    updateCriterion,

    submit,
  };
}