import { NextResponse } from "next/server";
import { runnerClaimSchema } from "@/lib/validators";
import { claimTaskForRunner } from "@/features/runners/runner-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = runnerClaimSchema.parse(await request.json());
  const result = await claimTaskForRunner(id, payload.hostId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result.task);
}
