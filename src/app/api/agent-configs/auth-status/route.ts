import { NextResponse } from "next/server";
import { listAgentConfigs } from "@/features/agent-configs/agent-config-service";
import { getCodexRuntimeStatus } from "@/features/codex-exec/codex-exec-service";

export async function GET() {
  const configs = await listAgentConfigs();
  const codexRuntime = getCodexRuntimeStatus();

  return NextResponse.json({
    codexRuntime,
    configs: configs.map((config) => {
      const apiKeyConfigured = config.apiKeyRef ? Boolean(process.env[config.apiKeyRef]) : false;
      const accountLoginAvailable =
        config.provider === "CODEX" ? codexRuntime.available : config.provider === "CHATGPT";

      return {
        id: config.id,
        name: config.name,
        provider: config.provider,
        authMode: config.authMode,
        apiKeyRef: config.apiKeyRef,
        status:
          config.authMode === "API_KEY"
            ? apiKeyConfigured
              ? "ready"
              : "missing_secret"
            : accountLoginAvailable
              ? "ready"
              : "manual_required",
        message:
          config.authMode === "API_KEY"
            ? apiKeyConfigured
              ? `Secret reference ${config.apiKeyRef} is present in the server environment.`
              : `Secret reference ${config.apiKeyRef ?? "(empty)"} is not present in the server environment.`
            : config.provider === "CODEX"
              ? codexRuntime.message
              : "ChatGPT account login is browser-based. Generate a prompt and paste it into ChatGPT."
      };
    })
  });
}
