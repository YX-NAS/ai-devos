import { NextResponse } from "next/server";
import { z } from "zod";
import { execCodex } from "@/features/codex-exec/codex-exec-service";
import { generatePlanningPrompt } from "@/features/codex-exec/planning-prompt";
import { parsePlanningOutput } from "@/features/codex-exec/planning-parser";
import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";

const planRequestSchema = z.object({
  goal: z.string().min(5),
  scope: z.string().optional(),
  projectId: z.string().optional(), // if provided, add tasks to existing project
  mode: z.enum(["auto", "dry-run"]).default("auto") // dry-run: parse only, don't create
});

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, scope, projectId, mode } = planRequestSchema.parse(body);

  // Step 1: Generate planning prompt and call Codex
  const prompt = generatePlanningPrompt(goal, scope);
  const result = await execCodex(prompt, { timeoutMs: 300000 }); // 5 min timeout

  if (result.timedOut) {
    return NextResponse.json(
      { error: "Codex planning timed out", partial: result.stdout.slice(-500) },
      { status: 504 }
    );
  }

  if (!result.stdout || result.stdout.length < 100) {
    return NextResponse.json(
      { error: "Codex returned insufficient output", stdout: result.stdout, stderr: result.stderr },
      { status: 500 }
    );
  }

  // Step 2: Parse Codex output into structured plan
  const plan = parsePlanningOutput(result.stdout);

  if (plan.tasks.length === 0) {
    return NextResponse.json(
      { error: "Failed to parse tasks from Codex output", rawOutput: result.stdout.slice(0, 1000) },
      { status: 422 }
    );
  }

  // Step 3: Dry-run mode — return plan without creating
  if (mode === "dry-run") {
    return NextResponse.json({ plan, rawOutput: result.stdout });
  }

  // Step 4: Create or reuse project
  await ensureDatabase();

  let project;
  if (projectId) {
    project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
  } else {
    const slug = plan.projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50);
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

    project = await prisma.project.create({
      data: {
        name: plan.projectName,
        slug: uniqueSlug,
        description: plan.planningSummary,
        category: "AI_PRODUCT",
        priority: "P1",
        stage: "DESIGN",
        currentGoal: goal,
        nextAction: plan.tasks[0]?.title ?? "Start execution"
      }
    });
  }

  // Step 5: Create tasks
  const createdTasks = [];
  for (const taskPlan of plan.tasks) {
    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        title: taskPlan.title,
        description: taskPlan.description,
        goal: taskPlan.goal,
        scope: taskPlan.scope,
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
    plan,
    rawOutput: result.stdout
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
