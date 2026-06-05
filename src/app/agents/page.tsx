import { Bot, Code2, UserRound } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { AgentCard } from "@/features/agents/agent-card";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Agents" description="展示 GPT、Codex、人工在项目生命周期里的清晰分工。" />
      <div className="grid gap-4 lg:grid-cols-3">
        <AgentCard title="GPT Agent" description="规划与拆分" icon={Bot} capabilities={["需求分析", "技术调研", "文档生成", "任务拆分"]} />
        <AgentCard title="Codex Agent" description="工程执行" icon={Code2} capabilities={["代码实现", "测试", "提交与 PR", "Bug Fix"]} />
        <AgentCard title="Human" description="决策与发布" icon={UserRound} capabilities={["目标决策", "验收", "风险判断", "发布"]} />
      </div>
    </div>
  );
}
