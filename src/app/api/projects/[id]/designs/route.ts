import { NextResponse } from "next/server";
import { designDocumentSchema } from "@/lib/validators";
import { createDesignDocument, listProjectDesigns } from "@/features/designs/design-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await listProjectDesigns(id));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = designDocumentSchema.parse(await request.json());
  const design = await createDesignDocument(id, payload);

  return NextResponse.json(design, { status: 201 });
}
