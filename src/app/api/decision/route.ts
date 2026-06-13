import { NextResponse } from "next/server";
import { Decision } from "@/types/decision";
import { calculateDecision } from "@/lib/engine/calculate";

const store: Decision[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  const decision: Decision = {
    id: crypto.randomUUID(),
    title: body.title || "Untitled Decision",
    options: body.options || [],
    criteria: body.criteria || [],
  };

  store.push(decision);

  const result = calculateDecision(decision);

  return NextResponse.json({
    decision,
    result,
  });
}

export async function GET() {
  return NextResponse.json(store);
}