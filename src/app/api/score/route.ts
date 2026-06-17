import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const score = await prisma.score.upsert({
      where: {
        optionId_criterionId: {
          optionId: body.optionId,
          criterionId: body.criterionId,
        },
      },
      update: {
        value: body.value,
      },
      create: {
        optionId: body.optionId,
        criterionId: body.criterionId,
        value: body.value,
      },
    });

    return NextResponse.json(score);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to save score" },
      { status: 500 }
    );
  }
}