import { NextResponse } from "next/server";
import { runnerSchema } from "@/lib/validators";
import { deleteRunner, getRunner, updateRunner } from "@/features/runners/runner-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const runner = await getRunner(id);

  if (!runner) {
    return NextResponse.json({ error: "Runner not found" }, { status: 404 });
  }

  return NextResponse.json(runner);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = runnerSchema.partial().parse(await request.json());
  const runner = await updateRunner(id, payload);

  return NextResponse.json(runner);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteRunner(id);

  return NextResponse.json({ ok: true });
}
