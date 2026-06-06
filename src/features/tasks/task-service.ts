import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import { generateCodexPrompt } from "@/features/task-templates/codex-prompt-generator";
import type { Prisma, TaskStatus } from "@prisma/client";

export async function listTasks() {
  await ensureDatabase();
  return prisma.task.findMany({
    orderBy: [{ status: "asc" }, { priority: "asc" }, { updatedAt: "desc" }],
    include: { project: true }
  });
}

export async function listProjectTasks(projectId: string) {
  await ensureDatabase();
  return prisma.task.findMany({
    where: { projectId },
    orderBy: [{ status: "asc" }, { priority: "asc" }]
  });
}

export async function createTask(projectId: string, data: Omit<Prisma.TaskCreateInput, "project">) {
  await ensureDatabase();
  const codexPrompt =
    data.codexPrompt ??
    generateCodexPrompt({
      title: String(data.title),
      goal: data.goal as string | null | undefined,
      scope: data.scope as string | null | undefined,
      planningSummary: data.planningSummary as string | null | undefined,
      implementationPlan: data.implementationPlan as string | null | undefined,
      codexBudgetNotes: data.codexBudgetNotes as string | null | undefined,
      relatedFiles: data.relatedFiles as string | null | undefined,
      acceptanceCriteria: data.acceptanceCriteria as string | null | undefined,
      requiresCommit: Boolean(data.requiresCommit),
      requiresPush: Boolean(data.requiresPush),
      requiresDeployment: Boolean(data.requiresDeployment)
    });

  return prisma.task.create({
    data: {
      ...data,
      codexPrompt,
      project: { connect: { id: projectId } }
    }
  });
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  await ensureDatabase();
  return prisma.task.update({ where: { id }, data: { status } });
}
