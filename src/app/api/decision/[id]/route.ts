import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { deleteDecision } from "@/lib/decision/delete-decision";
import { getDecision } from "@/lib/decision/get-decision";
import {
  updateDecision,
  type UpdateDecisionInput,
} from "@/lib/decision/update-decision";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type DecisionStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED";

function isClientValidationError(message: string) {
  return [
    "Invalid decision data",
    "Options must be an array",
    "Criteria must be an array",
    "Decision title is required",
    "At least one option is required",
    "Each option must have a name",
    "At least one criterion is required",
    "Each criterion must have a name",
    "Duplicate option IDs are not allowed",
    "Duplicate criterion IDs are not allowed",
    "Criteria weights must",
    "Each criterion weight",
  ].some((prefix) => message.startsWith(prefix));
}

function isDecisionStatus(value: unknown): value is DecisionStatus {
  return (
    value === "DRAFT" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED"
  );
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Decision ID is required" },
        { status: 400 }
      );
    }

    const decision = await getDecision(id);

    if (!decision) {
      return NextResponse.json(
        { message: "Decision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Failed to fetch decision:", error);

    return NextResponse.json(
      { message: "Failed to fetch decision" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Decision ID is required" },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Request body must contain valid JSON." },
        { status: 400 }
      );
    }

    const decision = await updateDecision(
      id,
      body as UpdateDecisionInput
    );

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Failed to update decision:", error);

    if (!(error instanceof Error)) {
      return NextResponse.json(
        { message: "Failed to update decision" },
        { status: 500 }
      );
    }

    if (error.message === "Decision not found") {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }

    if (isClientValidationError(error.message)) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update decision" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Decision ID is required" },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Request body must contain valid JSON." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        { message: "A valid status is required." },
        { status: 400 }
      );
    }

    if (!("status" in body)) {
      return NextResponse.json(
        { message: "A valid status is required." },
        { status: 400 }
      );
    }

    if (!isDecisionStatus(body.status)) {
      return NextResponse.json(
        {
          message:
            "Status must be DRAFT, IN_PROGRESS, or COMPLETED.",
        },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.update({
      where: { id },
      data: {
        status: body.status,
        isCompleted: body.status === "COMPLETED",
      },
    });

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Failed to update decision status:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Decision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update decision status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Decision ID is required" },
        { status: 400 }
      );
    }

    const deletedDecision = await deleteDecision(id);

    if (!deletedDecision) {
      return NextResponse.json(
        { message: "Decision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Decision deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete decision:", error);

    return NextResponse.json(
      { message: "Failed to delete decision" },
      { status: 500 }
    );
  }
}