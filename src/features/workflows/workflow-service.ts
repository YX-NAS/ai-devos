import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listProjectWorkflows(projectId: string) {
  await ensureDatabase();
  return prisma.workflowEvent.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
}

export async function createWorkflowEvent(
  projectId: string,
  data: Prisma.WorkflowEventUncheckedCreateInput
) {
  await ensureDatabase();
  return prisma.workflowEvent.create({
    data: { ...data, projectId }
  });
}
