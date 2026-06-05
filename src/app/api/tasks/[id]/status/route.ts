import { NextResponse } from "next/server";
import { taskStatusSchema } from "@/lib/validators";
import { updateTaskStatus } from "@/features/tasks/task-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { status } = taskStatusSchema.parse(await request.json());
  const task = await updateTaskStatus(id, status);

  return NextResponse.json(task);
}
