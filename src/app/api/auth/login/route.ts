import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

const COOKIE_NAME = "ai-devos-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.AI_DEVOS_ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const sessionToken = createHash("sha256")
    .update(`${adminPassword}:${Date.now()}:${Math.random()}`)
    .digest("hex");

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/"
  });

  return response;
}
