import { NextResponse } from "next/server";
import { listTasks } from "@/features/tasks/task-service";

export async function GET() {
  return NextResponse.json(await listTasks());
}
