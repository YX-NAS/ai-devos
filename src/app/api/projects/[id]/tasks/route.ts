import { NextResponse } from "next/server";
import { taskSchema } from "@/lib/validators";
import { createTask, listProjectTasks } from "@/features/tasks/task-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectTasks(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = taskSchema.parse(await request.json());
  const task = await createTask(id, payload);

  return NextResponse.json(task, { status: 201 });
}
