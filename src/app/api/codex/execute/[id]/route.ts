import { NextResponse } from "next/server";
import { execCodex } from "@/features/codex-exec/codex-exec-service";
import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  await ensureDatabase();

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true }
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (!task.codexPrompt) {
    return NextResponse.json({ error: "Task has no Codex prompt" }, { status: 400 });
  }

  // Execute with Codex
  const result = await execCodex(task.codexPrompt, {
    timeoutMs: 900000, // 15 min
    workdir: process.cwd()
  });

  if (result.timedOut) {
    return NextResponse.json({
      error: "Execution timed out",
      partialOutput: result.stdout.slice(-500)
    }, { status: 504 });
  }

  // Save execution result
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      executionResult: result.stdout.slice(-5000),
      commitSha: extractCommitSha(result.stdout),
      status: "REVIEW"
    }
  });

  return NextResponse.json({
    task: updatedTask,
    exitCode: result.exitCode,
    outputLength: result.stdout.length
  });
}

function extractCommitSha(output: string): string | null {
  const match = output.match(/commit\s+([a-f0-9]{7,40})/i);
  return match ? match[1] : null;
}
