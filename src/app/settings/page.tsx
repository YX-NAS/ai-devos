import { PageTitle } from "@/components/common/page-title";
import { AgentConfigTable } from "@/features/agent-configs/agent-config-table";
import { CreateProfileForm, EditProfileButton } from "./settings-form";
import { listAgentConfigs } from "@/features/agent-configs/agent-config-service";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const configs = await listAgentConfigs();
  const chatGptConfigs = configs.filter((config) => config.provider === "CHATGPT");
  const codexConfigs = configs.filter((config) => config.provider === "CODEX");

  return (
    <div className="space-y-6">
      <PageTitle title="Settings" description="配置 AI DevOS 的默认项目参数、ChatGPT 规划 Profile 和 Codex 执行 Profile。" />

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
