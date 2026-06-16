import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
        options: true,
        criteria: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(decisions);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}