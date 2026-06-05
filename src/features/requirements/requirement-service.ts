import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function listProjectRequirements(projectId: string) {
  return prisma.requirement.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" }
  });
}

export function createRequirement(
  projectId: string,
  data: Omit<Prisma.RequirementCreateInput, "project">
) {
  return prisma.requirement.create({
    data: { ...data, project: { connect: { id: projectId } } }
  });
}
