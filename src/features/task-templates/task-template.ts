export const codexTaskTemplateFields = [
  { key: "goal", zh: "目标", en: "Goal" },
  { key: "scope", zh: "范围", en: "Scope" },
  { key: "relatedFiles", zh: "相关文件", en: "Relevant files" },
  { key: "acceptanceCriteria", zh: "验收标准", en: "Acceptance criteria" },
  { key: "requiresCommit", zh: "是否需要 commit", en: "Commit required" },
  { key: "requiresPush", zh: "是否需要 push", en: "Push required" },
  { key: "requiresDeployment", zh: "是否需要部署", en: "Deployment required" }
] as const;

export type CodexTaskTemplateInput = {
  title: string;
  goal?: string | null;
  scope?: string | null;
  relatedFiles?: string | null;
  acceptanceCriteria?: string | null;
  requiresCommit?: boolean;
  requiresPush?: boolean;
  requiresDeployment?: boolean;
};

export function formatBooleanFlag(value?: boolean) {
  return value ? "是" : "否";
}
