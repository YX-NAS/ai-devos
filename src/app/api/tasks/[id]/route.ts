import { NextResponse } from "next/server";
import { taskSchema } from "@/lib/validators";
import { getTask, updateTask, deleteTask } from "@/features/tasks/task-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const task = await getTask(id);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = taskSchema.partial().parse(await request.json());
  const task = await updateTask(id, payload);

  return NextResponse.json(task);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteTask(id);

  return NextResponse.json({ ok: true });
}
