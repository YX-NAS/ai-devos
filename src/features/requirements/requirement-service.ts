import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listProjectRequirements(projectId: string) {
  await ensureDatabase();
  return prisma.requirement.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" }
  });
}

export async function createRequirement(
  projectId: string,
  data: Omit<Prisma.RequirementCreateInput, "project">
) {
  await ensureDatabase();
  return prisma.requirement.create({
    data: { ...data, project: { connect: { id: projectId } } }
  });
}
