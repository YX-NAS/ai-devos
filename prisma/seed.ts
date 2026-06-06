import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.workflowEvent.deleteMany();
  await prisma.projectAgentBinding.deleteMany();
  await prisma.agentConfig.deleteMany();
  await prisma.review.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.task.deleteMany();
  await prisma.designDocument.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.project.deleteMany();

  const aiDevos = await prisma.project.create({
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
      currentGoal: "完成 MVP 项目初始化并通过验收",
      nextAction: "运行 lint、build 与 API smoke test"
    }
  });

  const openMaic = await prisma.project.create({
    data: {
      name: "OpenMAIC",
      slug: "openmaic",
      description: "AI 教育与音乐创作工作流实验项目",
      repoName: "YX-NAS/openmaic",
      repoUrl: "https://github.com/YX-NAS/openmaic",
      category: "EDUCATION",
      priority: "P1",
      stage: "REVIEW",
      owner: "YX-NAS",
      currentGoal: "整理评审反馈",
      nextAction: "合并验收清单"
    }
  });

  const defaultGpt = await prisma.agentConfig.create({
    data: {
      id: "default-chatgpt-planning",
      name: "Default ChatGPT Planning",
      provider: "CHATGPT",
      role: "GPT",
      model: "ChatGPT",
      strategy: "需求分析、技术调研、PRD、技术设计和任务拆分，默认输出中文。",
      isDefault: true
    }
  });

  const defaultCodex = await prisma.agentConfig.create({
    data: {
      id: "default-codex-execution",
      name: "Default Codex Execution",
      provider: "CODEX",
      role: "CODEX",
      model: "Codex",
      strategy: "按任务模板执行，实现、验证、总结，并根据任务要求 commit、push、deploy。",
      isDefault: true
    }
  });

  await prisma.projectAgentBinding.createMany({
    data: [
      { projectId: aiDevos.id, configId: defaultGpt.id, purpose: "PLANNING" },
      { projectId: aiDevos.id, configId: defaultCodex.id, purpose: "EXECUTION" },
      { projectId: openMaic.id, configId: defaultGpt.id, purpose: "PLANNING" }
    ]
  });

  await prisma.requirement.createMany({
    data: [
      {
        projectId: aiDevos.id,
        title: "项目中心",
        description: "用户可以创建、查看、编辑和管理 AI 项目的生命周期信息。",
        priority: "P0"
      },
      {
        projectId: aiDevos.id,
        title: "任务中心",
        description: "统一查看所有项目任务，并按状态管理 Codex 执行流。",
        priority: "P0"
      },
      {
        projectId: aiDevos.id,
        title: "Prompt 中心",
        description: "沉淀 GPT 规划、Codex 执行、Review 与系统级 Prompt。",
        priority: "P1"
      }
    ]
  });

  await prisma.designDocument.create({
    data: {
      projectId: aiDevos.id,
      title: "AI DevOS MVP 技术设计",
      type: "TECH_DESIGN",
      content: "# 技术设计\n\nNext.js App Router 提供页面与 API，Prisma + SQLite 管理核心实体，TailwindCSS 构建后台控制台界面。",
      version: 1
    }
  });

  const initTask = await prisma.task.create({
    data: {
      projectId: aiDevos.id,
      title: "初始化 AI DevOS 项目",
      description: "创建 Next.js 项目并初始化 Prisma、基础页面、API 与验收脚本。",
      status: "READY_FOR_CODEX",
      priority: "P0",
      epic: "Epic 1",
      story: "Story 1.1",
      goal: "完成 AI DevOS MVP 初始化",
      scope: "项目初始化、目录结构、基础页面、API、种子数据",
      relatedFiles: "src/app, src/features, prisma/schema.prisma, README.md",
      acceptanceCriteria: "项目可启动；lint 通过；build 通过；基础页面和 API 可访问。",
      requiresCommit: true,
      requiresPush: true,
      requiresDeployment: true,
      codexPrompt: "请初始化 AI DevOS 项目，并创建基础目录结构、数据模型与页面。"
    }
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: aiDevos.id,
        title: "生成 Codex Prompt 模板",
        description: "把需求、设计、验收标准组织为可执行 Prompt。",
        status: "DESIGN",
        priority: "P1",
        goal: "建立标准 Codex 任务模板",
        scope: "任务字段、Prompt 生成、验收要求",
        relatedFiles: "src/features/task-templates, src/features/tasks",
        acceptanceCriteria: "创建任务时可填写模板字段，并生成 Codex Prompt。",
        requiresCommit: true,
        requiresPush: true,
        requiresDeployment: true
      },
      {
        projectId: openMaic.id,
        title: "完成项目复盘",
        description: "记录人工验收结果与下一轮规划。",
        status: "REVIEW",
        priority: "P1"
      },
      {
        projectId: aiDevos.id,
        title: "GitHub 发布准备",
        description: "初始化 Git、封装版本并准备推送远端仓库。",
        status: "TODO",
        priority: "P0"
      }
    ]
  });

  await prisma.prompt.createMany({
    data: [
      {
        projectId: aiDevos.id,
        title: "AI DevOS 初始化 Codex Prompt",
        type: "CODEX_EXECUTION",
        content: "根据 PRD、技术设计和验收标准完成 Next.js + Prisma MVP，并运行 lint/build 验证。",
        tags: "codex,init,nextjs,prisma"
      },
      {
        projectId: aiDevos.id,
        title: "GPT 规划 Prompt",
        type: "GPT_PLANNING",
        content: "围绕目标、约束、数据模型、页面、API 和验收标准拆分工程任务。",
        tags: "gpt,planning"
      }
    ]
  });

  await prisma.review.create({
    data: {
      projectId: aiDevos.id,
      taskId: initTask.id,
      title: "项目初始化验收",
      checklist: "Next.js 可启动；Prisma schema 可生成；lint 通过；build 通过；核心页面可访问。",
      result: "待验收",
      riskLevel: "low"
    }
  });

  await prisma.workflowEvent.createMany({
    data: [
      {
        projectId: aiDevos.id,
        agentType: "GPT",
        fromStage: "IDEA",
        toStage: "DESIGN",
        title: "完成产品与技术设计",
        description: "GPT 输出项目结构、数据模型、页面原型与 API 设计。"
      },
      {
        projectId: aiDevos.id,
        agentType: "CODEX",
        fromStage: "DESIGN",
        toStage: "READY_FOR_CODEX",
        title: "进入工程实现",
        description: "Codex 初始化项目并准备提交验收。"
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
