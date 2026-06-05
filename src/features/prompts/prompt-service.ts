import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function listPrompts() {
  return prisma.prompt.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: true }
  });
}

export function createPrompt(data: Prisma.PromptUncheckedCreateInput) {
  return prisma.prompt.create({ data });
}
