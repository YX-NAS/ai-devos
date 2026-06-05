import { NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validators";
import { createReview, listProjectReviews } from "@/features/reviews/review-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectReviews(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = reviewSchema.parse(await request.json());
  const review = await createReview(id, { ...payload, projectId: id });

  return NextResponse.json(review, { status: 201 });
}
