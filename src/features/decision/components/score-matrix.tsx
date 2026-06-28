"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Score = {
  id: string;
  value: number;
  criterionId: string;
};

type Option = {
  id: string;
  name: string;
  scores: Score[];
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Props = {
  decisionId: string;
  options: Option[];
  criteria: Criterion[];
};

export function ScoreMatrix({
  decisionId,
  options,
  criteria,
}: Props) {
  const initialScores = options.reduce<Record<string, number>>(
    (acc, option) => {
      option.scores.forEach((score) => {
        const key = `${option.id}-${score.criterionId}`;

        acc[key] = score.value;
      });

      return acc;
    },
    {}
  );

  const [scores, setScores] = useState(initialScores);
  const router = useRouter();

  function handleChange(
    optionId: string,
    criterionId: string,
    value: number
  ) {
    const key = `${optionId}-${criterionId}`;

    setScores((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveScores() {
    try {
      const payload = Object.entries(scores).map(
        ([key, value]) => {
          const [optionId, criterionId] =
            key.split("-");

          return {
            optionId,
            criterionId,
            value,
          };
        }
      );

      const res = await fetch(
        `/api/decision/${decisionId}/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save scores");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-3 text-left">
              Option
            </th>

            {criteria.map((criterion) => (
              <th
                key={criterion.id}
                className="border p-3"
              >
                {criterion.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {options.map((option) => (
            <tr key={option.id}>
              <td className="border p-3 font-medium">
                {option.name}
              </td>

              {criteria.map((criterion) => {
                const key = `${option.id}-${criterion.id}`;

                return (
                  <td
                    key={criterion.id}
                    className="border p-3"
                  >
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={scores[key] ?? ""}
                      onChange={(e) =>
                        handleChange(
                          option.id,
                          criterion.id,
                          Number(e.target.value)
                        )
                      }
                      className="w-20 rounded border px-2 py-1"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={saveScores}
        className="mt-4 rounded-lg border px-4 py-2 transition hover:bg-gray-100"
      >
        Save Scores
      </button>
    </div>
  );
}