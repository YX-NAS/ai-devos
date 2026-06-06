import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listDeployments(params?: {
  projectId?: string;
  environment?: string;
  status?: string;
}) {
  await ensureDatabase();
  return prisma.deploymentRecord.findMany({
    where: {
      ...(params?.projectId ? { projectId: params.projectId } : {}),
      ...(params?.environment ? { environment: params.environment } : {}),
      ...(params?.status ? { status: params.status } : {})
    },
    orderBy: { createdAt: "desc" },
    include: { project: true, task: true },
    take: 50
  });
}

export async function getDeployment(id: string) {
  await ensureDatabase();
  return prisma.deploymentRecord.findUnique({
    where: { id },
    include: { project: true, task: true }
  });
}

export async function listProjectDeployments(projectId: string) {
  await ensureDatabase();
  return prisma.deploymentRecord.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { task: true }
  });
}

export async function createDeployment(
  projectId: string,
  data: Omit<Prisma.DeploymentRecordCreateInput, "project">
) {
  await ensureDatabase();
  return prisma.deploymentRecord.create({
    data: {
      ...data,
      project: { connect: { id: projectId } }
    }
  });
}

export async function updateDeployment(
  id: string,
  data: Prisma.DeploymentRecordUpdateInput
) {
  await ensureDatabase();
  return prisma.deploymentRecord.update({ where: { id }, data });
}

export async function deleteDeployment(id: string) {
  await ensureDatabase();
  return prisma.deploymentRecord.delete({ where: { id } });
}
