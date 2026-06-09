import { NextResponse } from "next/server";
import { agentConfigSchema } from "@/lib/validators";
import {
  createAgentConfig,
  listAgentConfigs
} from "@/features/agent-configs/agent-config-service";


function maskApiKeyRef(configs: Array<{ apiKeyRef?: string | null; [key: string]: unknown }>) {
  return configs.map(config => ({
    ...config,
    apiKeyRef: config.apiKeyRef
      ? config.apiKeyRef.length > 8
        ? config.apiKeyRef.slice(0, 2) + "****" + config.apiKeyRef.slice(-2)
        : "****"
      : null
  }));
}

export async function GET() {
  const configs = await listAgentConfigs();
  return NextResponse.json(maskApiKeyRef(configs));
}

export async function POST(request: Request) {
  const payload = agentConfigSchema.parse(await request.json());
  const config = await createAgentConfig(payload);

  return NextResponse.json(config, { status: 201 });
}
