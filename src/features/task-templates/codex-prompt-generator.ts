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
    `相关文件：${input.relatedFiles || "未填写"}`,
    `验收标准：${input.acceptanceCriteria || "未填写"}`,
    `是否需要 commit：${formatBooleanFlag(input.requiresCommit)}`,
    `是否需要 push：${formatBooleanFlag(input.requiresPush)}`,
    `是否需要部署：${formatBooleanFlag(input.requiresDeployment)}`,
    "",
    "执行要求：",
    "1. 先阅读相关代码和上下文。",
    "2. 按现有技术栈和项目约定实现。",
    "3. 保持改动范围聚焦，不做无关重构。",
    "4. 运行必要验证，并说明验证结果。",
    "5. 如果需要 commit/push/deploy，请在完成后执行并报告结果。",
    "6. 输出执行摘要、风险和后续建议。"
  ].join("\n");
}
