import { NextRequest, NextResponse } from "next/server";
import { listDeployments } from "@/features/deployments/deployment-service";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId") ?? undefined;
  const environment = url.searchParams.get("environment") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;

  return NextResponse.json(await listDeployments({ projectId, environment, status }));
}
