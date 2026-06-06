import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listProjectDesigns(projectId: string) {
  await ensureDatabase();
  return prisma.designDocument.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createDesignDocument(
  projectId: string,
  data: Omit<Prisma.DesignDocumentCreateInput, "project">
) {
  await ensureDatabase();
  return prisma.designDocument.create({
    data: { ...data, project: { connect: { id: projectId } } }
  });
}
