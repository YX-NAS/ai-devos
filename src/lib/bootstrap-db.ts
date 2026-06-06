import { prisma } from "@/lib/prisma";

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "repoName" TEXT,
    "repoUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'AI_PRODUCT',
    "priority" TEXT NOT NULL DEFAULT 'P2',
    "stage" TEXT NOT NULL DEFAULT 'IDEA',
    "owner" TEXT,
    "currentGoal" TEXT,
    "nextAction" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Requirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'P2',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Requirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "DesignDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DesignDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'P2',
    "epic" TEXT,
    "story" TEXT,
    "scope" TEXT,
    "acceptanceCriteria" TEXT,
    "codexPrompt" TEXT,
    "resultSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Prompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GPT_PLANNING',
    "content" TEXT NOT NULL,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prompt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "taskId" TEXT,
    "title" TEXT NOT NULL,
    "checklist" TEXT,
    "result" TEXT,
    "riskLevel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "WorkflowEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "fromStage" TEXT,
    "toStage" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkflowEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`
];

let databaseReady: Promise<void> | null = null;

export function ensureDatabase() {
  databaseReady ??= bootstrapDatabase();
  return databaseReady;
}

async function bootstrapDatabase() {
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys=ON");

  for (const statement of schemaStatements) {
    await prisma.$executeRawUnsafe(statement);
  }

  const projectCount = await prisma.project.count();
  if (projectCount > 0) {
    return;
  }

  const project = await prisma.project.create({
    data: {
      name: "AI DevOS",
      slug: "ai-devos",
      description: "GPT 规划 + Codex 执行的 AI 开发总控台",
      repoName: "YX-NAS/ai-devos",
      repoUrl: "https://github.com/YX-NAS/ai-devos",
      category: "AI_PRODUCT",
      priority: "P0",
      stage: "READY_FOR_CODEX",
      owner: "YX-NAS",
      currentGoal: "完成 MVP 部署与线上验收",
      nextAction: "确认生产环境访问与后续数据持久化方案"
    }
  });

  await prisma.requirement.createMany({
    data: [
      {
        projectId: project.id,
        title: "项目中心",
        description: "用户可以创建、查看、编辑和管理 AI 项目的生命周期信息。",
        priority: "P0"
      },
      {
        projectId: project.id,
        title: "任务中心",
        description: "统一查看所有项目任务，并按状态管理 Codex 执行流。",
        priority: "P0"
      }
    ]
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project.id,
        title: "初始化 AI DevOS 项目",
        description: "创建 Next.js 项目并初始化 Prisma、基础页面、API 与验收脚本。",
        status: "DONE",
        priority: "P0"
      },
      {
        projectId: project.id,
        title: "部署 AI DevOS",
        description: "完成线上环境部署并验证页面/API 可访问。",
        status: "READY_FOR_CODEX",
        priority: "P0"
      }
    ]
  });

  await prisma.prompt.create({
    data: {
      projectId: project.id,
      title: "AI DevOS 部署 Codex Prompt",
      type: "CODEX_EXECUTION",
      content: "完成部署配置、云端初始化与线上 smoke test。",
      tags: "codex,deploy,vercel"
    }
  });
}
