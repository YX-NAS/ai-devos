import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function listProjectReviews(projectId: string) {
  return prisma.review.findMany({
    where: { projectId },
    include: { task: true },
    orderBy: { updatedAt: "desc" }
  });
}

export function createReview(projectId: string, data: Prisma.ReviewUncheckedCreateInput) {
  return prisma.review.create({
    data: { ...data, projectId }
  });
}
