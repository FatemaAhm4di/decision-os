"use client";

import { useState } from "react";

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
  options: Option[];
  criteria: Criterion[];
};

export function ScoreMatrix({
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

  async function handleChange(
    optionId: string,
    criterionId: string,
    value: number
  ) {
    const key = `${optionId}-${criterionId}`;

    setScores((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId,
          criterionId,
          value,
        }),
      });
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
    </div>
  );
}