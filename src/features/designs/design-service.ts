import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function listProjectDesigns(projectId: string) {
  return prisma.designDocument.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" }
  });
}

export function createDesignDocument(
  projectId: string,
  data: Omit<Prisma.DesignDocumentCreateInput, "project">
) {
  return prisma.designDocument.create({
    data: { ...data, project: { connect: { id: projectId } } }
  });
}
