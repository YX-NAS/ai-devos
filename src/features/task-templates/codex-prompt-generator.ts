import {
  type CodexTaskTemplateInput,
  formatBooleanFlag
} from "@/features/task-templates/task-template";

export function generateCodexPrompt(input: CodexTaskTemplateInput) {
  return [
    "请根据以下任务进行开发，直到验收通过，可以交付。",
    "",
    `任务：${input.title}`,
    `目标：${input.goal || "未填写"}`,
    `范围：${input.scope || "未填写"}`,
    `ChatGPT 规划摘要：${input.planningSummary || "未填写"}`,
    `建议实现步骤：${input.implementationPlan || "未填写"}`,
    `Codex 省额度说明：${input.codexBudgetNotes || "未填写"}`,
    `相关文件：${input.relatedFiles || "未填写"}`,
    `验收标准：${input.acceptanceCriteria || "未填写"}`,
    `是否需要 commit：${formatBooleanFlag(input.requiresCommit)}`,
    `是否需要 push：${formatBooleanFlag(input.requiresPush)}`,
    `是否需要部署：${formatBooleanFlag(input.requiresDeployment)}`,
    "",
    "低额度协作要求：",
    "1. ChatGPT 已完成规划，Codex 不要重新做大范围方案探索。",
    "2. 优先阅读“相关文件”中列出的文件；只有必要时再扩展搜索范围。",
    "3. 严格按照“建议实现步骤”执行，发现阻塞时用最短问题反馈。",
    "4. 保持改动范围聚焦，不做无关重构，不引入不必要依赖。",
    "5. 运行必要验证，并说明验证结果。",
    "6. 如果需要 commit/push/deploy，请在完成后执行并报告结果。",
    "7. 输出执行摘要、风险和后续建议。"
  ].join("\n");
}
