import { NextResponse } from "next/server";
import { agentConfigSchema } from "@/lib/validators";
import {
  createAgentConfig,
  listAgentConfigs
} from "@/features/agent-configs/agent-config-service";

export async function GET() {
  return NextResponse.json(await listAgentConfigs());
}

export async function POST(request: Request) {
  const payload = agentConfigSchema.parse(await request.json());
  const config = await createAgentConfig(payload);

  return NextResponse.json(config, { status: 201 });
}
