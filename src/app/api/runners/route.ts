import { NextResponse } from "next/server";
import { runnerSchema } from "@/lib/validators";
import { createRunner, listRunners } from "@/features/runners/runner-service";

export async function GET() {
  return NextResponse.json(await listRunners());
}

export async function POST(request: Request) {
  const payload = runnerSchema.parse(await request.json());
  const runner = await createRunner(payload);

  return NextResponse.json(runner, { status: 201 });
}
