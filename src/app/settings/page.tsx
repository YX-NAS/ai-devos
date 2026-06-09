import { PageTitle } from "@/components/common/page-title";
import { AgentConfigTable } from "@/features/agent-configs/agent-config-table";
import { CreateProfileForm, EditProfileButton } from "./settings-form";
import { listAgentConfigs } from "@/features/agent-configs/agent-config-service";
import { getCodexRuntimeStatus } from "@/features/codex-exec/codex-exec-service";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const configs = await listAgentConfigs();
  const chatGptConfigs = configs.filter((config) => config.provider === "CHATGPT");
  const codexConfigs = configs.filter((config) => config.provider === "CODEX");
  const codexRuntime = getCodexRuntimeStatus();

  return (
    <div className="space-y-6">
      <PageTitle title="Settings" description="配置 AI DevOS 的默认项目参数、ChatGPT 规划 Profile 和 Codex 执行 Profile。" />

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-950">Authorization Status</h2>
        <p className="mt-1 text-sm text-zinc-500">
          检查账号登录、API Key 引用和 Codex CLI 运行环境是否可用。
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className={`rounded-md border p-4 ${codexRuntime.available ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <p className="text-sm font-semibold text-zinc-950">Codex Runtime</p>
            <p className="mt-1 text-xs leading-5 text-zinc-600">{codexRuntime.message}</p>
            <p className="mt-2 font-mono text-xs text-zinc-500">{codexRuntime.bin}</p>
          </div>
          {configs.map((config) => {
            const apiKeyReady = config.apiKeyRef ? Boolean(process.env[config.apiKeyRef]) : false;
            const ready = config.authMode === "API_KEY" ? apiKeyReady : config.provider === "CODEX" ? codexRuntime.available : true;
            return (
              <div key={config.id} className={`rounded-md border p-4 ${ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zinc-950">{config.name}</p>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${ready ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {ready ? "Ready" : "Needs setup"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-600">
                  {config.provider} · {config.authMode === "API_KEY" ? `Secret ref: ${config.apiKeyRef ?? "未填写"}` : "账号登录"}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {config.authMode === "API_KEY"
                    ? apiKeyReady
                      ? "服务器环境变量中已找到该引用。"
                      : "服务器环境变量中未找到该引用；请在 .env 或部署环境中配置。"
                    : config.provider === "CODEX"
                      ? codexRuntime.message
                      : "ChatGPT 使用浏览器账号登录，请通过 Quick Plan 复制 Prompt 到 ChatGPT。"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">ChatGPT Profiles</h2>
          <p className="mt-1 text-sm text-zinc-500">用于记录 GPT 规划、需求分析、技术设计和任务拆分策略。</p>
        </div>
        <div className="mb-4">
          <CreateProfileForm />
        </div>
        <AgentConfigTable configs={chatGptConfigs} renderAction={(config) => <EditProfileButton config={config} />} />
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Codex Profiles</h2>
          <p className="mt-1 text-sm text-zinc-500">用于记录 Codex 执行、验证、commit、push 和部署策略。</p>
        </div>
        <div className="mb-4">
          <CreateProfileForm />
        </div>
        <AgentConfigTable configs={codexConfigs} renderAction={(config) => <EditProfileButton config={config} />} />
      </section>
    </div>
  );
}
