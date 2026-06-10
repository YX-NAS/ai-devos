import { NextResponse } from "next/server";
import { runnerCompleteSchema } from "@/lib/validators";
import { completeRunnerTask } from "@/features/runners/runner-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = runnerCompleteSchema.parse(await request.json());
  const result = await completeRunnerTask(id, payload.hostId, payload);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result.task);
}
