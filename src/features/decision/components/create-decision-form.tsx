"use client";

import { useState } from "react";

type DecisionResponse = {
  id: string;
  title: string;
  createdAt: string;
};

type Option = {
  id: string;
  name: string;
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Props = {
  onCreated?: () => void;

  initialTitle?: string;

  initialOptions?: Option[];

  initialCriteria?: Criterion[];

  mode?: "create" | "edit";

  decisionId?: string;
};

export function CreateDecisionForm({
  onCreated,
  initialTitle = "",
  initialOptions,
  initialCriteria,
  mode = "create",
  decisionId,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  const [options, setOptions] = useState<Option[]>(
    initialOptions ?? [
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]
  );

  const [criteria, setCriteria] = useState<Criterion[]>(
    initialCriteria ?? [
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]
  );

  const [response, setResponse] =
    useState<DecisionResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  function addOption() {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]);
  }

  function removeOption(id: string) {
    setOptions((prev) =>
      prev.filter((option) => option.id !== id)
    );
  }

  function updateOption(id: string, name: string) {
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
  }

  function addCriterion() {
    setCriteria((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]);
  }

  function removeCriterion(id: string) {
    setCriteria((prev) =>
      prev.filter(
        (criterion) => criterion.id !== id
      )
    );
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
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/decision/${decisionId}`
          : "/api/decision";

      const method =
        mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          options,
          criteria,
        }),
      });

      const data: DecisionResponse =
        await res.json();

      setResponse(data);

      if (mode === "create") {
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

      onCreated?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Enter decision title"
          className="w-full rounded-lg border px-4 py-2"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Options
            </h3>

            <button
              type="button"
              onClick={addOption}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              Add Option
            </button>
          </div>

          {options.map((option) => (
            <div
              key={option.id}
              className="flex gap-2"
            >
              <input
                value={option.name}
                onChange={(e) =>
                  updateOption(
                    option.id,
                    e.target.value
                  )
                }
                placeholder="Option name"
                className="flex-1 rounded-lg border px-4 py-2"
              />

              <button
                type="button"
                onClick={() =>
                  removeOption(option.id)
                }
                className="rounded-lg border px-3"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Criteria
            </h3>

            <button
              type="button"
              onClick={addCriterion}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              Add Criterion
            </button>
          </div>

          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex gap-2"
            >
              <input
                value={criterion.name}
                onChange={(e) =>
                  updateCriterion(
                    criterion.id,
                    "name",
                    e.target.value
                  )
                }
                placeholder="Criterion name"
                className="flex-1 rounded-lg border px-4 py-2"
              />

              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={criterion.weight}
                onChange={(e) =>
                  updateCriterion(
                    criterion.id,
                    "weight",
                    Number(e.target.value)
                  )
                }
                className="w-24 rounded-lg border px-4 py-2"
              />

              <button
                type="button"
                onClick={() =>
                  removeCriterion(
                    criterion.id
                  )
                }
                className="rounded-lg border px-3"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg border px-4 py-2"
        >
          {isLoading
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
            ? "Save Changes"
            : "Create Decision"}
        </button>
      </form>

      {response && (
        <pre className="mt-6 overflow-auto rounded-lg border p-4 text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}