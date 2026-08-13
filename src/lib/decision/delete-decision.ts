import { prisma } from "@/lib/prisma";

export async function deleteDecision(
  decisionId: string
) {
  return prisma.decision.delete({
    where: {
      id: decisionId,
    },
  });
}