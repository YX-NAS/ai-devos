import { NextResponse } from "next/server";
import { runnerFailSchema } from "@/lib/validators";
import { failRunnerTask } from "@/features/runners/runner-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = runnerFailSchema.parse(await request.json());
  const result = await failRunnerTask(id, payload.hostId, payload);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result.task);
}
