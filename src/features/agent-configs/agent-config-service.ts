import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listAgentConfigs() {
  await ensureDatabase();
  return prisma.agentConfig.findMany({
    orderBy: [{ isDefault: "desc" }, { provider: "asc" }, { updatedAt: "desc" }],
    include: { bindings: { include: { project: true } } }
  });
}

export async function getAgentConfig(id: string) {
  await ensureDatabase();
  return prisma.agentConfig.findUnique({
    where: { id },
    include: { bindings: { include: { project: true } } }
  });
}

export async function createAgentConfig(data: Prisma.AgentConfigCreateInput) {
  await ensureDatabase();
  return prisma.agentConfig.create({ data });
}

export async function updateAgentConfig(id: string, data: Prisma.AgentConfigUpdateInput) {
  await ensureDatabase();
  return prisma.agentConfig.update({ where: { id }, data });
}

export async function deleteAgentConfig(id: string) {
  await ensureDatabase();
  return prisma.agentConfig.delete({ where: { id } });
}

export async function listProjectAgentBindings(projectId: string) {
  await ensureDatabase();
  return prisma.projectAgentBinding.findMany({
    where: { projectId },
    include: { config: true },
    orderBy: { createdAt: "asc" }
  });
}

export async function createProjectAgentBinding(
  projectId: string,
  configId: string,
  purpose: string
) {
  await ensureDatabase();
  return prisma.projectAgentBinding.create({
    data: { projectId, configId, purpose },
    include: { config: true }
  });
}
