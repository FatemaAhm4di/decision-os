
"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";

type ExportScore = {
  criterionId: string;
  value: number;
};

type ExportOption = {
  id: string;
  name: string;
  scores: ExportScore[];
};

type ExportCriterion = {
  id: string;
  name: string;
  weight: number;
};

type ExportResult = {
  optionId: string;
  name: string;
  score: number;
};

type ExportDecisionButtonProps = {
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  options: ExportOption[];
  criteria: ExportCriterion[];
  results: ExportResult[];
};

function escapeCsv(value: string | number): string {
  let text = String(value);

  // Prevent spreadsheet formula injection in user-provided text.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function formatScore(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return "";
  }

  return Number(value.toFixed(2)).toString();
}

function createFileName(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return `${slug || "decision"}-report.csv`;
}

export function ExportDecisionButton({
  title,
  status,
  createdAt,
  updatedAt,
  options,
  criteria,
  results,
}: ExportDecisionButtonProps) {
  function handleExport() {
    const rows: (string | number)[][] = [
      ["Decision report"],
      ["Title", title],
      ["Status", status],
      ["Created at", createdAt],
      ["Last updated", updatedAt],
      [],
      ["Score matrix"],
      [
        "Option",
        ...criteria.map(
          (criterion) =>
            `${criterion.name} (${formatScore(criterion.weight * 100)}%)`
        ),
        "Final weighted score",
        "Rank",
      ],
    ];

    const rankedResults = [...results].sort(
      (a, b) => b.score - a.score
    );

    const getRank = (optionId: string): string => {
      const result = rankedResults.find(
        (item) => item.optionId === optionId
      );

      if (!result) {
        return "";
      }

      return String(
        rankedResults.findIndex(
          (item) => item.score === result.score
        ) + 1
      );
    };

    options.forEach((option) => {
      const scoreByCriterion = new Map(
        option.scores.map((score) => [
          score.criterionId,
          score.value,
        ])
      );

      const result = results.find(
        (item) => item.optionId === option.id
      );

      rows.push([
        option.name,
        ...criteria.map((criterion) => {
          const score = scoreByCriterion.get(criterion.id);
          return score === undefined ? "" : formatScore(score);
        }),
        result ? formatScore(result.score) : "",
        getRank(option.id),
      ]);
    });

    rows.push([]);
    rows.push(["Criteria details"]);
    rows.push(["Criterion", "Weight", "Weight percentage"]);

    criteria.forEach((criterion) => {
      rows.push([
        criterion.name,
        formatScore(criterion.weight),
        `${formatScore(criterion.weight * 100)}%`,
      ]);
    });

    const csvContent = [
      "\uFEFF",
      rows
        .map((row) => row.map(escapeCsv).join(","))
        .join("\r\n"),
    ].join("");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createFileName(title);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      className="w-full sm:w-auto"
    >
      <Download className="mr-2 size-4" />
      Export CSV
    </Button>
  );
}
