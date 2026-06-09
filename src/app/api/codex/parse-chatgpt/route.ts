import { NextResponse } from "next/server";
import { z } from "zod";
import { parsePlanningOutput } from "@/features/codex-exec/planning-parser";
import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";

const parseRequestSchema = z.object({
  text: z.string().min(100),
  goal: z.string().optional(),
  scope: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const { text, goal, scope } = parseRequestSchema.parse(body);

  const plan = parsePlanningOutput(text);

  if (plan.tasks.length === 0) {
    return NextResponse.json(
      { error: "Failed to parse tasks from ChatGPT output. Ensure output follows the format: ### 任务 N: title with - 描述, - 目标, etc." },
      { status: 422 }
    );
  }

  await ensureDatabase();

  const slug = plan.projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);
  const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

  const project = await prisma.project.create({
    data: {
      name: plan.projectName,
      slug: uniqueSlug,
      description: plan.planningSummary,
      category: "AI_PRODUCT",
      priority: "P1",
      stage: "DESIGN",
      currentGoal: goal ?? plan.projectName,
      nextAction: plan.tasks[0]?.title ?? "Start execution"
    }
  });

  await bindDefaultAgents(project.id);

  const createdTasks = [];
  for (const taskPlan of plan.tasks) {
    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        title: taskPlan.title,
        description: taskPlan.description,
        goal: taskPlan.goal,
        scope: taskPlan.scope || scope || "",
        planningSummary: plan.planningSummary,
        implementationPlan: taskPlan.implementationPlan,
        codexBudgetNotes: plan.codexBudgetNotes,
        relatedFiles: taskPlan.relatedFiles,
        acceptanceCriteria: taskPlan.acceptanceCriteria,
        requiresCommit: taskPlan.requiresCommit,
        requiresPush: taskPlan.requiresPush,
        requiresDeployment: taskPlan.requiresDeployment,
        codexPrompt: taskPlan.codexPrompt,
        status: "READY_FOR_CODEX",
        priority: "P1"
      }
    });
    createdTasks.push(task);
  }

  return NextResponse.json({
    project,
    tasks: createdTasks,
    plan
  });
}

async function bindDefaultAgents(projectId: string) {
  const defaultConfigs = await prisma.agentConfig.findMany({
    where: { isDefault: true }
  });
  
  for (const config of defaultConfigs) {
    const purpose = config.role === "GPT" ? "PLANNING" : "EXECUTION";
    const existing = await prisma.projectAgentBinding.findFirst({
      where: { projectId, configId: config.id }
    });
    if (!existing) {
      await prisma.projectAgentBinding.create({
        data: { projectId, configId: config.id, purpose }
      });
    }
  }
}
