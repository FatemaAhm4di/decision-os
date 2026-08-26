import { prisma } from "@/lib/prisma";

export async function deleteDecision(
  decisionId: string
) {
  const decision = await prisma.decision.findUnique({
    where: {
      id: decisionId,
    },
    select: {
      id: true,
    },
  });

  if (!decision) {
    return null;
  }

  return prisma.decision.delete({
    where: {
      id: decisionId,
    },
  });
}