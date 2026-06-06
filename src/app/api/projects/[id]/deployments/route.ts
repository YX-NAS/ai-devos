import { NextResponse } from "next/server";
import { deploymentRecordSchema } from "@/lib/validators";
import {
  listProjectDeployments,
  createDeployment
} from "@/features/deployments/deployment-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectDeployments(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = deploymentRecordSchema.parse(await request.json());
  const deployment = await createDeployment(id, payload);

  return NextResponse.json(deployment, { status: 201 });
}
