import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateCriteriaWeights } from "@/lib/validation/decision";

type CreateDecisionBody = {
  title: string;
  options: { name: string }[];
  criteria: { name: string; weight: number }[];
};

function isCreateDecisionBody(
  body: unknown
): body is CreateDecisionBody {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const value = body as Record<string, unknown>;

  return (
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    Array.isArray(value.options) &&
    value.options.length > 0 &&
    value.options.every(
      (option) =>
        typeof option === "object" &&
        option !== null &&
        "name" in option &&
        typeof option.name === "string"
    ) &&
    Array.isArray(value.criteria) &&
    value.criteria.length > 0 &&
    value.criteria.every(
      (criterion) =>
        typeof criterion === "object" &&
        criterion !== null &&
        "name" in criterion &&
        typeof criterion.name === "string" &&
        "weight" in criterion &&
        typeof criterion.weight === "number"
    )
  );
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must contain valid JSON." },
      { status: 400 }
    );
  }

  if (!isCreateDecisionBody(body)) {
    return NextResponse.json(
      {
        message:
          "Provide a title, at least one named option, and at least one named criterion with a numeric weight.",
      },
      { status: 400 }
    );
  }

  const title = body.title.trim();

  const options = body.options
    .map((option) => ({ name: option.name.trim() }))
    .filter((option) => option.name.length > 0);

  const criteria = body.criteria
    .map((criterion) => ({
      name: criterion.name.trim(),
      weight: criterion.weight,
    }))
    .filter((criterion) => criterion.name.length > 0);

  if (options.length === 0) {
    return NextResponse.json(
      { message: "At least one non-empty option is required." },
      { status: 400 }
    );
  }

  if (criteria.length === 0) {
    return NextResponse.json(
      { message: "At least one non-empty criterion is required." },
      { status: 400 }
    );
  }

  try {
    validateCriteriaWeights(criteria);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Invalid criteria weights.",
      },
      { status: 400 }
    );
  }

  try {
    const decision = await prisma.decision.create({
      data: {
        title,
        status: "DRAFT",
        isCompleted: false,
        options: {
          create: options,
        },
        criteria: {
          create: criteria,
        },
      },
      include: {
        options: true,
        criteria: true,
      },
    });

    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    console.error("Failed to create decision:", error);

    return NextResponse.json(
      { message: "Failed to create decision." },
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
      return {
        ...decision,
        isCompleted: decision.status === "COMPLETED",
      };
    });

    return NextResponse.json(decisionsWithStatus);
  } catch (error) {
    console.error("Failed to fetch decisions:", error);

    return NextResponse.json(
      { message: "Failed to fetch decisions." },
      { status: 500 }
    );
  }
}