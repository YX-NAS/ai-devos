import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/validators";
import { deleteProject, getProject, updateProject } from "@/features/projects/project-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = await getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = projectSchema.partial().parse(await request.json());
  const project = await updateProject(id, {
    ...payload,
    repoUrl: payload.repoUrl || undefined
  });

  return NextResponse.json(project);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteProject(id);

  return NextResponse.json({ ok: true });
}
