
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ScoreInput = {
  optionId: string;
  criterionId: string;
  value: number;
};

function isScoreInput(score: unknown): score is ScoreInput {
  if (typeof score !== "object" || score === null) {
    return false;
  }

  const item = score as Record<string, unknown>;

  return (
    typeof item.optionId === "string" &&
    item.optionId.trim().length > 0 &&
    typeof item.criterionId === "string" &&
    item.criterionId.trim().length > 0 &&
    typeof item.value === "number" &&
    Number.isFinite(item.value) &&
    item.value >= 0 &&
    item.value <= 10
  );
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must contain valid JSON." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { message: "Scores must be an array." },
      { status: 400 }
    );
  }

  const scores: unknown[] = body;

  if (!scores.every(isScoreInput)) {
    return NextResponse.json(
      {
        message:
          "Each score must include valid optionId, criterionId, and a value between 0 and 10.",
      },
      { status: 400 }
    );
  }

  try {
    const { id: decisionId } = await params;

    if (!decisionId?.trim()) {
      return NextResponse.json(
        { message: "Decision ID is required." },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.findUnique({
      where: { id: decisionId },
      select: {
        options: {
          select: { id: true },
        },
        criteria: {
          select: { id: true },
        },
      },
    });

    if (!decision) {
      return NextResponse.json(
        { message: "Decision not found." },
        { status: 404 }
      );
    }

    if (
      decision.options.length === 0 ||
      decision.criteria.length === 0
    ) {
      return NextResponse.json(
        {
          message:
            "A decision must have at least one option and one criterion before scores can be saved.",
        },
        { status: 400 }
      );
    }

    const expectedScoreCount =
      decision.options.length * decision.criteria.length;

    if (scores.length !== expectedScoreCount) {
      return NextResponse.json(
        {
          message:
            "A score is required for every option and criterion.",
        },
        { status: 400 }
      );
    }

    const optionIds = new Set(
      decision.options.map((option) => option.id)
    );

    const criterionIds = new Set(
      decision.criteria.map((criterion) => criterion.id)
    );

    const uniqueKeys = new Set<string>();

    for (const score of scores) {
      if (
        !optionIds.has(score.optionId) ||
        !criterionIds.has(score.criterionId)
      ) {
        return NextResponse.json(
          {
            message:
              "One or more options or criteria do not belong to this decision.",
          },
          { status: 400 }
        );
      }

      const key = JSON.stringify([
        score.optionId,
        score.criterionId,
      ]);

      if (uniqueKeys.has(key)) {
        return NextResponse.json(
          {
            message:
              "Duplicate option and criterion combinations are not allowed.",
          },
          { status: 400 }
        );
      }

      uniqueKeys.add(key);
    }

    for (const option of decision.options) {
      for (const criterion of decision.criteria) {
        const key = JSON.stringify([
          option.id,
          criterion.id,
        ]);

        if (!uniqueKeys.has(key)) {
          return NextResponse.json(
            {
              message:
                "A score is required for every option and criterion.",
            },
            { status: 400 }
          );
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.score.deleteMany({
        where: {
          option: {
            decisionId,
          },
        },
      });

      await tx.score.createMany({
        data: scores.map((score) => ({
          value: score.value,
          optionId: score.optionId,
          criterionId: score.criterionId,
        })),
      });
    });

    return NextResponse.json(
      { message: "Scores saved successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to save scores:", error);

    return NextResponse.json(
      { message: "Failed to save scores." },
      { status: 500 }
    );
  }
}
