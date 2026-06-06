import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

export async function listProjectReviews(projectId: string) {
  await ensureDatabase();
  return prisma.review.findMany({
    where: { projectId },
    include: { task: true },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createReview(projectId: string, data: Prisma.ReviewUncheckedCreateInput) {
  await ensureDatabase();
  return prisma.review.create({
    data: { ...data, projectId }
  });
}
