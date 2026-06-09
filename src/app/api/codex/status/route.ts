import { NextResponse } from "next/server";
import { getCodexRuntimeStatus } from "@/features/codex-exec/codex-exec-service";

export async function GET() {
  return NextResponse.json(getCodexRuntimeStatus());
}
