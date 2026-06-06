import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listProjects() {
  await ensureDatabase();
  return prisma.project.findMany({
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          requirements: true,
          designs: true,
          tasks: true,
          reviews: true,
          workflows: true
        }
      }
    }
  });
}

export async function getProject(id: string) {
  await ensureDatabase();
  return prisma.project.findUnique({
    where: { id },
    include: {
      requirements: { orderBy: { createdAt: "desc" } },
      designs: { orderBy: { updatedAt: "desc" } },
      tasks: { orderBy: [{ status: "asc" }, { priority: "asc" }] },
      prompts: { orderBy: { updatedAt: "desc" } },
      reviews: { include: { task: true }, orderBy: { updatedAt: "desc" } },
      workflows: { orderBy: { createdAt: "asc" } },
      agentBindings: { include: { config: true }, orderBy: { createdAt: "asc" } }
    }
  });
}

export async function createProject(data: Prisma.ProjectCreateInput) {
  await ensureDatabase();
  return prisma.project.create({ data });
}

export async function updateProject(id: string, data: Prisma.ProjectUpdateInput) {
  await ensureDatabase();
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  await ensureDatabase();
  return prisma.project.delete({ where: { id } });
}

export async function getDashboardData() {
  await ensureDatabase();
  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: { tasks: true }
    }),
    prisma.task.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: { project: true }
    })
  ]);

  return {
    projects,
    tasks,
    stats: {
      totalProjects: projects.length,
      readyForCodex: tasks.filter((task) => task.status === "READY_FOR_CODEX").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      blocked: projects.filter((project) => project.stage === "BLOCKED").length
    }
  };
}
