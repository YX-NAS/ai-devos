import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function listProjects() {
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

export function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      requirements: { orderBy: { createdAt: "desc" } },
      designs: { orderBy: { updatedAt: "desc" } },
      tasks: { orderBy: [{ status: "asc" }, { priority: "asc" }] },
      prompts: { orderBy: { updatedAt: "desc" } },
      reviews: { include: { task: true }, orderBy: { updatedAt: "desc" } },
      workflows: { orderBy: { createdAt: "asc" } }
    }
  });
}

export function createProject(data: Prisma.ProjectCreateInput) {
  return prisma.project.create({ data });
}

export function updateProject(id: string, data: Prisma.ProjectUpdateInput) {
  return prisma.project.update({ where: { id }, data });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function getDashboardData() {
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
