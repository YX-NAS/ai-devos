import { NextResponse } from "next/server";
import { agentConfigSchema } from "@/lib/validators";
import {
  deleteAgentConfig,
  getAgentConfig,
  updateAgentConfig
} from "@/features/agent-configs/agent-config-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const config = await getAgentConfig(id);

  if (!config) {
    return NextResponse.json({ error: "Agent config not found" }, { status: 404 });
  }

  return NextResponse.json(config);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = agentConfigSchema.partial().parse(await request.json());
  const config = await updateAgentConfig(id, payload);

  return NextResponse.json(config);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteAgentConfig(id);

  return NextResponse.json({ ok: true });
}
