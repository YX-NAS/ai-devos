import { PageTitle } from "@/components/common/page-title";
import { AgentConfigTable } from "@/features/agent-configs/agent-config-table";
import { listAgentConfigs } from "@/features/agent-configs/agent-config-service";

const settings = [
  ["默认项目分类", "AI_PRODUCT"],
  ["默认优先级", "P2"],
  ["默认阶段", "IDEA"],
  ["GitHub 账号", "YX-NAS"],
  ["New API 地址", "待配置"],
  ["Codex 使用策略", "按任务验收标准执行，完成后提交 PR"]
];

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const configs = await listAgentConfigs();
  const chatGptConfigs = configs.filter((config) => config.provider === "CHATGPT");
  const codexConfigs = configs.filter((config) => config.provider === "CODEX");

  return (
    <div className="space-y-6">
      <PageTitle title="Settings" description="配置 AI DevOS 的默认项目参数、ChatGPT 规划 Profile 和 Codex 执行 Profile。" />
      <div className="rounded-lg border border-zinc-200 bg-white">
        {settings.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-2 border-b border-zinc-200 px-5 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-zinc-700">{label}</p>
            <p className="text-sm text-zinc-950">{value}</p>
          </div>
        ))}
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">ChatGPT Profiles</h2>
          <p className="mt-1 text-sm text-zinc-500">用于记录 GPT 规划、需求分析、技术设计和任务拆分策略。</p>
        </div>
        <AgentConfigTable configs={chatGptConfigs} />
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Codex Profiles</h2>
          <p className="mt-1 text-sm text-zinc-500">用于记录 Codex 执行、验证、commit、push 和部署策略。</p>
        </div>
        <AgentConfigTable configs={codexConfigs} />
      </section>
    </div>
  );
}
