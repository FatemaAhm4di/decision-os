
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Decision ID is required." },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.findUnique({
      where: { id },
      select: {
        id: true,
        notes: true,
      },
    });

    if (!decision) {
      return NextResponse.json(
        { message: "Decision not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      notes: decision.notes,
    });
  } catch (error) {
    console.error("Failed to fetch decision notes:", error);

    return NextResponse.json(
      { message: "Failed to fetch decision notes." },
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
        { message: "Decision ID is required." },
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
      body === null ||
      !("notes" in body) ||
      typeof body.notes !== "string"
    ) {
      return NextResponse.json(
        { message: "Notes must be a valid string." },
        { status: 400 }
      );
    }

    if (body.notes.length > 10000) {
      return NextResponse.json(
        {
          message: "Notes cannot exceed 10,000 characters.",
        },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.update({
      where: { id },
      data: {
        notes: body.notes,
      },
      select: {
        id: true,
        notes: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Failed to save decision notes:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Decision not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to save decision notes." },
      { status: 500 }
    );
  }
}
