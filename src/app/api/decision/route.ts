import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateCriteriaWeights } from "@/lib/validation/decision";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    validateCriteriaWeights(body.criteria);

    const decision = await prisma.decision.create({
      data: {
        title: body.title,
        options: {
          create: body.options
            .filter(
              (option: { name: string }) =>
                option.name.trim() !== ""
            )
            .map((option: { name: string }) => ({
              name: option.name,
            })),
        },
        criteria: {
          create: body.criteria
            .filter(
              (criterion: { name: string }) =>
                criterion.name.trim() !== ""
            )
            .map(
              (criterion: {
                name: string;
                weight: number;
              }) => ({
                name: criterion.name,
                weight: criterion.weight,
              })
            ),
        },
      },
      include: {
        options: true,
        criteria: true,
      },
    });

    return NextResponse.json(decision);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create decision" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const decisions = await prisma.decision.findMany({
      include: {
        options: {
          include: {
            scores: {
              select: {
                id: true,
                criterionId: true,
                value: true,
              },
            },
          },
        },
        criteria: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const decisionsWithStatus = decisions.map((decision) => {
      const expectedScoreCount =
        decision.options.length * decision.criteria.length;

      const actualScoreCount = decision.options.reduce(
        (total, option) => total + option.scores.length,
        0
      );

      const hasCompleteScores =
        expectedScoreCount > 0 &&
        actualScoreCount === expectedScoreCount;

      return {
        id: decision.id,
        title: decision.title,
        createdAt: decision.createdAt,
        updatedAt: decision.updatedAt,
        options: decision.options.map((option) => ({
          id: option.id,
          name: option.name,
          decisionId: option.decisionId,
        })),
        criteria: decision.criteria,
        isCompleted: hasCompleteScores,
      };
    });

    return NextResponse.json(decisionsWithStatus);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}