import { NextResponse } from "next/server";
import { projectAgentBindingSchema } from "@/lib/validators";
import {
  createProjectAgentBinding,
  listProjectAgentBindings
} from "@/features/agent-configs/agent-config-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectAgentBindings(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = projectAgentBindingSchema.parse(await request.json());
  const binding = await createProjectAgentBinding(id, payload.configId, payload.purpose);

  return NextResponse.json(binding, { status: 201 });
}
