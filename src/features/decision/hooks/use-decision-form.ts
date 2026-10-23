
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);

  const [options, setOptions] = useState<DecisionOption[]>(
    initialOptions ?? [
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]
  );

  const [criteria, setCriteria] = useState<DecisionCriterion[]>(
    initialCriteria ?? [
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validOptions = useMemo(
    () => options.filter((option) => option.name.trim().length > 0),
    [options]
  );

  const validCriteria = useMemo(
    () =>
      criteria.filter(
        (criterion) => criterion.name.trim().length > 0
      ),
    [criteria]
  );

  const totalWeight = useMemo(
    () =>
      validCriteria.reduce(
        (sum, criterion) => sum + criterion.weight,
        0
      ),
    [validCriteria]
  );

  const roundedTotalWeight = Number(totalWeight.toFixed(2));

  const hasValidWeights = validCriteria.every(
    (criterion) =>
      Number.isFinite(criterion.weight) &&
      criterion.weight >= 0 &&
      criterion.weight <= 1
  );

  const isWeightValid =
    validCriteria.length > 0 &&
    hasValidWeights &&
    Math.abs(totalWeight - 1) <= 0.001;

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
      setError("At least one option is required.");
      return;
    }

    setOptions((prev) =>
      prev.filter((option) => option.id !== id)
    );

    clearError();
  }

  function updateOption(id: string, name: string) {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, name } : option
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
      setError("At least one criterion is required.");
      return;
    }

    setCriteria((prev) =>
      prev.filter((criterion) => criterion.id !== id)
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
          ? { ...criterion, [field]: value }
          : criterion
      )
    );

    clearError();
  }

  function validateForm() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a decision title.");
      return null;
    }

    if (validOptions.length === 0) {
      setError("Add at least one option.");
      return null;
    }

    if (validCriteria.length === 0) {
      setError("Add at least one criterion.");
      return null;
    }

    const hasInvalidWeight = validCriteria.some(
      (criterion) =>
        !Number.isFinite(criterion.weight) ||
        criterion.weight < 0 ||
        criterion.weight > 1
    );

    if (hasInvalidWeight) {
      setError("Each criterion weight must be between 0 and 1.");
      return null;
    }

    if (!isWeightValid) {
      setError(
        `Criteria weights must equal 1. Current total: ${roundedTotalWeight.toFixed(2)}`
      );
      return null;
    }

    if (mode === "edit" && !decisionId) {
      setError("Decision ID is missing.");
      return null;
    }

    return {
      title: trimmedTitle,
      options: validOptions.map((option) => ({
        id: option.id,
        name: option.name.trim(),
      })),
      criteria: validCriteria.map((criterion) => ({
        id: criterion.id,
        name: criterion.name.trim(),
        weight: Number(criterion.weight.toFixed(2)),
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

      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Unable to save decision."
        );
      }

      if (mode === "create") {
        resetForm();
      }

      onCreated?.();

      if (!onCreated) {
        if (mode === "edit" && decisionId) {
          router.push(`/decision/${decisionId}`);
        } else {
          router.push("/");
        }

        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save decision:", error);

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

    setError(null);
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
