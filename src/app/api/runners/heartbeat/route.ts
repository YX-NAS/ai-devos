import { NextResponse } from "next/server";
import { runnerHeartbeatSchema } from "@/lib/validators";
import { heartbeatRunner } from "@/features/runners/runner-service";

export async function POST(request: Request) {
  const payload = runnerHeartbeatSchema.parse(await request.json());
  const runner = await heartbeatRunner(payload);

  return NextResponse.json(runner);
}
