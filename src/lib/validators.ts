import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  repoName: z.string().optional().nullable(),
  repoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  category: z
    .enum([
      "WORK",
      "SIDE_PROJECT",
      "AI_PRODUCT",
      "CONTENT",
      "LOCAL_AI",
      "FINANCE",
      "EDUCATION",
      "MUSIC",
      "INFRASTRUCTURE"
    ])
    .default("AI_PRODUCT"),
  priority: z.enum(["P0", "P1", "P2", "P3"]).default("P2"),
  stage: z
    .enum([
      "IDEA",
      "RESEARCH",
      "DESIGN",
      "READY_FOR_CODEX",
      "IN_CODEX",
      "REVIEW",
      "DONE",
      "BLOCKED"
    ])
    .default("IDEA"),
  owner: z.string().optional().nullable(),
  currentGoal: z.string().optional().nullable(),
  nextAction: z.string().optional().nullable()
});

export const requirementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["P0", "P1", "P2", "P3"]).default("P2"),
  status: z.string().default("active")
});

export const designDocumentSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  content: z.string().min(1),
  version: z.number().int().positive().default(1)
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z
    .enum([
      "TODO",
      "RESEARCH",
      "DESIGN",
      "READY_FOR_CODEX",
      "IN_PROGRESS",
      "REVIEW",
      "DONE",
      "BLOCKED"
    ])
    .default("TODO"),
  priority: z.enum(["P0", "P1", "P2", "P3"]).default("P2"),
  epic: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  goal: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  planningSummary: z.string().optional().nullable(),
  implementationPlan: z.string().optional().nullable(),
  codexBudgetNotes: z.string().optional().nullable(),
  relatedFiles: z.string().optional().nullable(),
  acceptanceCriteria: z.string().optional().nullable(),
  requiresCommit: z.coerce.boolean().default(false),
  requiresPush: z.coerce.boolean().default(false),
  requiresDeployment: z.coerce.boolean().default(false),
  codexPrompt: z.string().optional().nullable(),
  resultSummary: z.string().optional().nullable()
});

export const taskStatusSchema = z.object({
  status: z.enum([
    "TODO",
    "RESEARCH",
    "DESIGN",
    "READY_FOR_CODEX",
    "IN_PROGRESS",
    "REVIEW",
    "DONE",
    "BLOCKED"
  ])
});

export const promptSchema = z.object({
  projectId: z.string().optional().nullable(),
  title: z.string().min(1),
  type: z
    .enum(["GPT_PLANNING", "CODEX_EXECUTION", "REVIEW", "SYSTEM"])
    .default("GPT_PLANNING"),
  content: z.string().min(1),
  tags: z.string().optional().nullable()
});

export const reviewSchema = z.object({
  taskId: z.string().optional().nullable(),
  title: z.string().min(1),
  checklist: z.string().optional().nullable(),
  result: z.string().optional().nullable(),
  riskLevel: z.string().optional().nullable()
});

export const workflowEventSchema = z.object({
  agentType: z.enum(["GPT", "CODEX", "HUMAN", "SYSTEM"]),
  fromStage: z.string().optional().nullable(),
  toStage: z.string().optional().nullable(),
  title: z.string().min(1),
  description: z.string().optional().nullable()
});

export const agentConfigSchema = z.object({
  name: z.string().min(1),
  provider: z.enum(["CHATGPT", "CODEX", "OPENAI_API", "LOCAL"]),
  role: z.enum(["GPT", "CODEX", "HUMAN", "SYSTEM"]),
  model: z.string().optional().nullable(),
  endpoint: z.string().optional().nullable(),
  apiKeyRef: z.string().optional().nullable(),
  strategy: z.string().optional().nullable(),
  isDefault: z.coerce.boolean().default(false)
});

export const projectAgentBindingSchema = z.object({
  configId: z.string().min(1),
  purpose: z.string().min(1)
});
