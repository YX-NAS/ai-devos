import { NextResponse } from "next/server";
import { requirementSchema } from "@/lib/validators";
import { createRequirement, listProjectRequirements } from "@/features/requirements/requirement-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectRequirements(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = requirementSchema.parse(await request.json());
  const requirement = await createRequirement(id, payload);

  return NextResponse.json(requirement, { status: 201 });
}
