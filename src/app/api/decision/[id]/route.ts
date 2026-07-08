import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDecision } from "@/lib/decision/update-decision";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const decision = await prisma.decision.findUnique({
      where: {
        id,
      },
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
        { message: "Decision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch decision",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const decision = await updateDecision(
      id,
      body
    );

    return NextResponse.json(decision);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update decision",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    await prisma.decision.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Decision deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete decision",
      },
      {
        status: 500,
      }
    );
  }
}