import { PageTitle } from "@/components/common/page-title";
import { PromptTable } from "@/features/prompts/prompt-table";
import { listPrompts } from "@/features/prompts/prompt-service";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const prompts = await listPrompts();

  return (
    <div className="space-y-6">
      <PageTitle title="Prompts" description="管理 GPT 规划、Codex 执行、Review 和系统级 Prompt。" />
      <PromptTable prompts={prompts} />
    </div>
  );
}
