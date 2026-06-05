import type {
  AgentType,
  Priority,
  ProjectCategory,
  ProjectStage,
  PromptType,
  TaskStatus
} from "@prisma/client";

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  WORK: "工作",
  SIDE_PROJECT: "业余",
  AI_PRODUCT: "AI 产品",
  CONTENT: "内容",
  LOCAL_AI: "本地 AI",
  FINANCE: "金融",
  EDUCATION: "教育",
  MUSIC: "音乐",
  INFRASTRUCTURE: "基础设施"
};

export const priorityLabels: Record<Priority, string> = {
  P0: "P0",
  P1: "P1",
  P2: "P2",
  P3: "P3"
};

export const projectStageLabels: Record<ProjectStage, string> = {
  IDEA: "Idea",
  RESEARCH: "Research",
  DESIGN: "Design",
  READY_FOR_CODEX: "Ready for Codex",
  IN_CODEX: "In Codex",
  REVIEW: "Review",
  DONE: "Done",
  BLOCKED: "Blocked"
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: "TODO",
  RESEARCH: "Research",
  DESIGN: "Design",
  READY_FOR_CODEX: "Ready Codex",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
  BLOCKED: "Blocked"
};

export const promptTypeLabels: Record<PromptType, string> = {
  GPT_PLANNING: "GPT Planning",
  CODEX_EXECUTION: "Codex Execution",
  REVIEW: "Review",
  SYSTEM: "System"
};

export const agentTypeLabels: Record<AgentType, string> = {
  GPT: "GPT Agent",
  CODEX: "Codex Agent",
  HUMAN: "Human",
  SYSTEM: "System"
};

export const workflowStages: ProjectStage[] = [
  "IDEA",
  "RESEARCH",
  "DESIGN",
  "READY_FOR_CODEX",
  "IN_CODEX",
  "REVIEW",
  "DONE"
];
