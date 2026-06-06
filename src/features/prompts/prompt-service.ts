import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listPrompts() {
  await ensureDatabase();
  return prisma.prompt.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: true }
  });
}

export async function createPrompt(data: Prisma.PromptUncheckedCreateInput) {
  await ensureDatabase();
  return prisma.prompt.create({ data });
}
