import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";

const COOKIE_NAME = "ai-devos-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.AI_DEVOS_ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  if (!password || !safeCompare(password, adminPassword)) {
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
