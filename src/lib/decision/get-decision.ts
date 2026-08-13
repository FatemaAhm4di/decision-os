import { prisma } from "@/lib/prisma";

export async function getDecision(
  decisionId: string
) {
  return prisma.decision.findUnique({
    where: {
      id: decisionId,
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
}