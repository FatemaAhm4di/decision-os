import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      { message: "Failed to fetch decision" },
      { status: 500 }
    );
  }
}