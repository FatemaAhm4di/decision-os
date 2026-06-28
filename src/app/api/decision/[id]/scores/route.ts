import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const scores = await request.json();

    await prisma.score.deleteMany({
      where: {
        option: {
          decisionId: id,
        },
      },
    });

    await prisma.score.createMany({
      data: scores,
    });

    return NextResponse.json({
      message: "Scores saved successfully",
    });
  } catch (error) {
    console.error(error);

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