import { NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_COOKIE = "portfolio_admin";
const maxFailedAttempts = 5;
const windowMs = 15 * 60 * 1000;
const lockMs = 10 * 60 * 1000;

type LoginAttempt = {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
};

const attempts = new Map<string, LoginAttempt>();

function getClientId(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown";
}

function getAttempt(clientId: string, now: number) {
  const attempt = attempts.get(clientId);

  if (!attempt || now - attempt.firstAttemptAt > windowMs) {
    return { count: 0, firstAttemptAt: now };
  }

  return attempt;
}

function isSamePassword(input: unknown, expected: string) {
  if (typeof input !== "string") return false;

  const inputHash = crypto.createHash("sha256").update(input).digest();
  const expectedHash = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientId = getClientId(request);
  const now = Date.now();
  const attempt = getAttempt(clientId, now);

  if (!adminPassword) {
    return NextResponse.json({ success: false, error: "ADMIN_PASSWORD not configured" }, { status: 500 });
  }

  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const retryAfter = Math.ceil((attempt.lockedUntil - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  if (!isSamePassword(password, adminPassword)) {
    const nextAttempt: LoginAttempt = {
      count: attempt.count + 1,
      firstAttemptAt: attempt.firstAttemptAt,
    };

    if (nextAttempt.count >= maxFailedAttempts) {
      nextAttempt.lockedUntil = now + lockMs;
    }

    attempts.set(clientId, nextAttempt);
    return NextResponse.json({ success: false }, { status: 401 });
  }

  attempts.delete(clientId);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
