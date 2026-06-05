import { NextResponse } from "next/server";
import { workflowEventSchema } from "@/lib/validators";
import { createWorkflowEvent, listProjectWorkflows } from "@/features/workflows/workflow-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectWorkflows(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = workflowEventSchema.parse(await request.json());
  const event = await createWorkflowEvent(id, { ...payload, projectId: id });

  return NextResponse.json(event, { status: 201 });
}
