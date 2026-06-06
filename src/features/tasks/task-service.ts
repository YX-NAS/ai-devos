import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
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
  return prisma.task.create({
    data: {
      ...data,
      project: { connect: { id: projectId } }
    }
  });
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  await ensureDatabase();
  return prisma.task.update({ where: { id }, data: { status } });
}
