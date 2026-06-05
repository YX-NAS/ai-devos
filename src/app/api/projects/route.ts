import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/validators";
import { createProject, listProjects } from "@/features/projects/project-service";

export async function GET() {
  return NextResponse.json(await listProjects());
}

export async function POST(request: Request) {
  const payload = projectSchema.parse(await request.json());
  const project = await createProject({
    ...payload,
    repoUrl: payload.repoUrl || null
  });

  return NextResponse.json(project, { status: 201 });
}
