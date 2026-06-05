import { prisma } from "@/lib/prisma";
import type { Prisma, TaskStatus } from "@prisma/client";

export function listTasks() {
  return prisma.task.findMany({
    orderBy: [{ status: "asc" }, { priority: "asc" }, { updatedAt: "desc" }],
    include: { project: true }
  });
}

export function listProjectTasks(projectId: string) {
  return prisma.task.findMany({
    where: { projectId },
    orderBy: [{ status: "asc" }, { priority: "asc" }]
  });
}

export function createTask(projectId: string, data: Omit<Prisma.TaskCreateInput, "project">) {
  return prisma.task.create({
    data: {
      ...data,
      project: { connect: { id: projectId } }
    }
  });
}

export function updateTaskStatus(id: string, status: TaskStatus) {
  return prisma.task.update({ where: { id }, data: { status } });
}
