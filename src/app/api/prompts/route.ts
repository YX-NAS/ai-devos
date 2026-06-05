import { NextResponse } from "next/server";
import { promptSchema } from "@/lib/validators";
import { createPrompt, listPrompts } from "@/features/prompts/prompt-service";

export async function GET() {
  return NextResponse.json(await listPrompts());
}

export async function POST(request: Request) {
  const payload = promptSchema.parse(await request.json());
  const prompt = await createPrompt(payload);

  return NextResponse.json(prompt, { status: 201 });
}
