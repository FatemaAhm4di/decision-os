
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

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id: decisionId } = await params;

    if (!decisionId) {
      return NextResponse.json(
        {
          message: "Decision ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const body: unknown = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          message: "Scores must be an array",
        },
        {
          status: 400,
        }
      );
    }

    const scores = body as unknown[];

    const isValidScores = scores.every(
      (score): score is ScoreInput => {
        if (
          typeof score !== "object" ||
          score === null
        ) {
          return false;
        }

        const item = score as Record<
          string,
          unknown
        >;

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
    );

    if (!isValidScores) {
      return NextResponse.json(
        {
          message:
            "Each score must include valid optionId, criterionId and a value between 0 and 10",
        },
        {
          status: 400,
        }
      );
    }

    const decision =
      await prisma.decision.findUnique({
        where: {
          id: decisionId,
        },
        include: {
          options: {
            select: {
              id: true,
            },
          },
          criteria: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!decision) {
      return NextResponse.json(
        {
          message: "Decision not found",
        },
        {
          status: 404,
        }
      );
    }

    const optionIds = new Set(
      decision.options.map(
        (option) => option.id
      )
    );

    const criterionIds = new Set(
      decision.criteria.map(
        (criterion) => criterion.id
      )
    );

    const hasInvalidRelation = scores.some(
      (score) =>
        !optionIds.has(score.optionId) ||
        !criterionIds.has(score.criterionId)
    );

    if (hasInvalidRelation) {
      return NextResponse.json(
        {
          message:
            "One or more options or criteria do not belong to this decision",
        },
        {
          status: 400,
        }
      );
    }

    const uniqueKeys = new Set<string>();

    const hasDuplicates = scores.some(
      (score) => {
        const key = `${score.optionId}:${score.criterionId}`;

        if (uniqueKeys.has(key)) {
          return true;
        }

        uniqueKeys.add(key);

        return false;
      }
    );

    if (hasDuplicates) {
      return NextResponse.json(
        {
          message:
            "Duplicate option and criterion combinations are not allowed",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.score.deleteMany({
        where: {
          option: {
            decisionId,
          },
        },
      });

      if (scores.length === 0) {
        return;
      }

      await tx.score.createMany({
        data: scores.map((score) => ({
          value: score.value,
          optionId: score.optionId,
          criterionId: score.criterionId,
        })),
      });
    });

    return NextResponse.json(
      {
        message: "Scores saved successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Failed to save scores:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to save scores",
      },
      {
        status: 500,
      }
    );
  }
}
