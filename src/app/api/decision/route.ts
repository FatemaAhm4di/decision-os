import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const decision = await prisma.decision.create({
      data: {
        title: body.title || "Untitled Decision",
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