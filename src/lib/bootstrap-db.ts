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
    "goal" TEXT,
    "scope" TEXT,
    "planningSummary" TEXT,
    "implementationPlan" TEXT,
    "codexBudgetNotes" TEXT,
    "relatedFiles" TEXT,
    "acceptanceCriteria" TEXT,
    "requiresCommit" BOOLEAN NOT NULL DEFAULT false,
    "requiresPush" BOOLEAN NOT NULL DEFAULT false,
    "requiresDeployment" BOOLEAN NOT NULL DEFAULT false,
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
  )`,
  `CREATE TABLE IF NOT EXISTS "AgentConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "model" TEXT,
    "endpoint" TEXT,
    "apiKeyRef" TEXT,
    "strategy" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "ProjectAgentBinding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectAgentBinding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectAgentBinding_configId_fkey" FOREIGN KEY ("configId") REFERENCES "AgentConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`
];

const taskColumnMigrations = [
  { name: "goal", statement: `ALTER TABLE "Task" ADD COLUMN "goal" TEXT` },
  { name: "scope", statement: `ALTER TABLE "Task" ADD COLUMN "scope" TEXT` },
  { name: "planningSummary", statement: `ALTER TABLE "Task" ADD COLUMN "planningSummary" TEXT` },
  { name: "implementationPlan", statement: `ALTER TABLE "Task" ADD COLUMN "implementationPlan" TEXT` },
  { name: "codexBudgetNotes", statement: `ALTER TABLE "Task" ADD COLUMN "codexBudgetNotes" TEXT` },
  { name: "relatedFiles", statement: `ALTER TABLE "Task" ADD COLUMN "relatedFiles" TEXT` },
  { name: "requiresCommit", statement: `ALTER TABLE "Task" ADD COLUMN "requiresCommit" BOOLEAN NOT NULL DEFAULT false` },
  { name: "requiresPush", statement: `ALTER TABLE "Task" ADD COLUMN "requiresPush" BOOLEAN NOT NULL DEFAULT false` },
  { name: "requiresDeployment", statement: `ALTER TABLE "Task" ADD COLUMN "requiresDeployment" BOOLEAN NOT NULL DEFAULT false` }
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

  await migrateTaskColumns();

  const [defaultGpt, defaultCodex] = await ensureDefaultAgentConfigs();

  const projectCount = await prisma.project.count();
  if (projectCount > 0) {
    await ensureProjectDefaultBindings(defaultGpt.id, defaultCodex.id);
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
        priority: "P0",
        goal: "完成 AI DevOS 1.0 初始化",
        scope: "Next.js、Prisma、页面、API、Docker 部署",
        planningSummary: "ChatGPT 已确认 MVP 采用 Next.js App Router、Prisma、SQLite 和 Docker 部署。",
        implementationPlan: "创建项目结构；实现核心页面和 API；补齐 Dockerfile；运行 lint/build。",
        codexBudgetNotes: "只围绕初始化文件执行，不重新评估技术栈。",
        relatedFiles: "src/app, prisma/schema.prisma, Dockerfile",
        acceptanceCriteria: "页面和 API 可访问；构建通过；Docker 容器健康。",
        requiresCommit: true,
        requiresPush: true,
        requiresDeployment: true
      },
      {
        projectId: project.id,
        title: "部署 AI DevOS",
        description: "完成线上环境部署并验证页面/API 可访问。",
        status: "READY_FOR_CODEX",
        priority: "P0",
        goal: "完成 AI DevOS 容器化部署",
        scope: "Docker Compose、Nginx、HTTPS、健康检查",
        planningSummary: "ChatGPT 已确认使用新加坡节点 Docker + Nginx 反代到域名。",
        implementationPlan: "更新部署配置；构建镜像；重启容器；验证域名和 API。",
        codexBudgetNotes: "优先检查 Docker/Nginx 相关文件和服务器状态，不做应用功能改造。",
        relatedFiles: "docker-compose.yml, docs/13_DOCKER_DEPLOYMENT.md",
        acceptanceCriteria: "https://codex.5176nas.site 可访问；/api/projects 返回项目数据。",
        requiresCommit: true,
        requiresPush: true,
        requiresDeployment: true
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

  await prisma.projectAgentBinding.createMany({
    data: [
      { projectId: project.id, configId: defaultGpt.id, purpose: "PLANNING" },
      { projectId: project.id, configId: defaultCodex.id, purpose: "EXECUTION" }
    ]
  });
}

async function ensureProjectDefaultBindings(gptConfigId: string, codexConfigId: string) {
  const projects = await prisma.project.findMany({ select: { id: true } });

  for (const project of projects) {
    const planningBinding = await prisma.projectAgentBinding.findFirst({
      where: { projectId: project.id, purpose: "PLANNING" }
    });
    const executionBinding = await prisma.projectAgentBinding.findFirst({
      where: { projectId: project.id, purpose: "EXECUTION" }
    });

    if (!planningBinding) {
      await prisma.projectAgentBinding.create({
        data: { projectId: project.id, configId: gptConfigId, purpose: "PLANNING" }
      });
    }

    if (!executionBinding) {
      await prisma.projectAgentBinding.create({
        data: { projectId: project.id, configId: codexConfigId, purpose: "EXECUTION" }
      });
    }
  }
}

async function migrateTaskColumns() {
  const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>('PRAGMA table_info("Task")');
  const existingColumns = new Set(columns.map((column) => column.name));

  for (const migration of taskColumnMigrations) {
    if (!existingColumns.has(migration.name)) {
      await prisma.$executeRawUnsafe(migration.statement);
    }
  }
}

async function ensureDefaultAgentConfigs() {
  const gpt = await prisma.agentConfig.upsert({
    where: { id: "default-chatgpt-planning" },
    update: {},
    create: {
      id: "default-chatgpt-planning",
      name: "Default ChatGPT Planning",
      provider: "CHATGPT",
      role: "GPT",
      model: "ChatGPT",
      strategy: "需求分析、技术设计、任务拆分，默认输出中文，保留 Codex 可执行上下文。",
      isDefault: true
    }
  });

  const codex = await prisma.agentConfig.upsert({
    where: { id: "default-codex-execution" },
    update: {},
    create: {
      id: "default-codex-execution",
      name: "Default Codex Execution",
      provider: "CODEX",
      role: "CODEX",
      model: "Codex",
      strategy: "先阅读代码，按任务模板实现，运行验证，按需 commit、push、deploy。",
      isDefault: true
    }
  });

  return [gpt, codex] as const;
}
