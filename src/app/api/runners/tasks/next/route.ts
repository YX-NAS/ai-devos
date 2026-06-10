import { NextResponse } from "next/server";
import { getNextTaskForRunner } from "@/features/runners/runner-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hostId = searchParams.get("hostId")?.trim();

  if (!hostId) {
    return NextResponse.json({ error: "hostId is required" }, { status: 400 });
  }

  const task = await getNextTaskForRunner(hostId);
  return NextResponse.json({ task });
}
