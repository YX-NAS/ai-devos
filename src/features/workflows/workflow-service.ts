import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function listProjectWorkflows(projectId: string) {
  return prisma.workflowEvent.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
}

export function createWorkflowEvent(
  projectId: string,
  data: Prisma.WorkflowEventUncheckedCreateInput
) {
  return prisma.workflowEvent.create({
    data: { ...data, projectId }
  });
}
