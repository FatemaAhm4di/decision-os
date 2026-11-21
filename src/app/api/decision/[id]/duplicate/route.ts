
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const decision = await prisma.decision.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            scores: true,
          },
        },
        criteria: true,
      },
    });

    if (!decision) {
      return NextResponse.json(
        { error: "Decision not found." },
        { status: 404 }
      );
    }

    const duplicatedDecision = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newDecision = await tx.decision.create({
          data: {
            title: `${decision.title} (Copy)`,
            criteria: {
              create: decision.criteria.map((criterion) => ({
                name: criterion.name,
                weight: criterion.weight,
              })),
            },
            options: {
              create: decision.options.map((option) => ({
                name: option.name,
              })),
            },
          },
          include: {
            criteria: true,
            options: true,
          },
        });

        const criteriaById = new Map(
          decision.criteria.map((criterion) => [
            criterion.id,
            criterion,
          ])
        );

        const scores = decision.options.flatMap((option) =>
          option.scores.map((score) => {
            const newOption = newDecision.options.find(
              (item) => item.name === option.name
            );

            const criterion = criteriaById.get(score.criterionId);

            const newCriterion = newDecision.criteria.find(
              (item) => item.name === criterion?.name
            );

            if (!newOption || !newCriterion) {
              throw new Error("Failed to map duplicated score.");
            }

            return {
              value: score.value,
              optionId: newOption.id,
              criterionId: newCriterion.id,
            };
          })
        );

        if (scores.length > 0) {
          await tx.score.createMany({
            data: scores,
          });
        }

        return tx.decision.findUniqueOrThrow({
          where: { id: newDecision.id },
          include: {
            options: {
              include: {
                scores: true,
              },
            },
            criteria: true,
          },
        });
      }
    );

    return NextResponse.json(
      { decision: duplicatedDecision },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to duplicate decision:", error);

    return NextResponse.json(
      { error: "Failed to duplicate decision." },
      { status: 500 }
    );
  }
}
