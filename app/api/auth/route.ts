import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const ADMIN_COOKIE = "portfolio_admin";
const CSRF_COOKIE = "portfolio_admin_csrf";
const authLogPath = path.join(process.cwd(), "data", "admin-auth-events.jsonl");
const maxFailedAttempts = 5;
const windowMs = 15 * 60 * 1000;
const lockMs = 10 * 60 * 1000;
const passwordHashPrefix = "pbkdf2_sha256";

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

function maskClientId(clientId: string) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(clientId)) {
    return clientId.replace(/\.\d{1,3}$/, ".0");
  }

  if (clientId.includes(":")) {
    return `${clientId.split(":").slice(0, 3).join(":")}::`;
  }

  return clientId === "unknown" ? "unknown" : "masked";
}

async function appendAuthEvent(event: {
  result: "success" | "failure" | "locked";
  clientId: string;
  failedCount?: number;
}) {
  try {
    await fs.mkdir(path.dirname(authLogPath), { recursive: true });
    await fs.appendFile(
      authLogPath,
      `${JSON.stringify({
        at: new Date().toISOString(),
        result: event.result,
        client: maskClientId(event.clientId),
        failedCount: event.failedCount,
      })}\n`,
      "utf-8",
    );
  } catch {
    // Authentication should not fail because audit logging is temporarily unavailable.
  }
}

function getAttempt(clientId: string, now: number) {
  const attempt = attempts.get(clientId);

  if (!attempt || now - attempt.firstAttemptAt > windowMs) {
    return { count: 0, firstAttemptAt: now };
  }

  return attempt;
}

function isSameText(input: string, expected: string) {
  const inputHash = crypto.createHash("sha256").update(input).digest();
  const expectedHash = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

function isSamePassword(input: unknown, expected: string) {
  if (typeof input !== "string") return false;

  return isSameText(input, expected);
}

function isSamePasswordHash(input: unknown, expectedHash: string) {
  if (typeof input !== "string") return false;

  const [scheme, iterationsText, salt, storedHash] = expectedHash.split("$");
  const iterations = Number(iterationsText);

  if (scheme !== passwordHashPrefix || !Number.isInteger(iterations) || iterations < 100000 || !salt || !storedHash) {
    return false;
  }

  const derivedHash = crypto.pbkdf2Sync(input, salt, iterations, 32, "sha256").toString("base64url");
  return isSameText(derivedHash, storedHash);
}

function hasValidAdminPassword(input: unknown) {
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPasswordHash) {
    return isSamePasswordHash(input, adminPasswordHash);
  }

  if (adminPassword) {
    return isSamePassword(input, adminPassword);
  }

  return null;
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const clientId = getClientId(request);
  const now = Date.now();
  const attempt = getAttempt(clientId, now);
  const passwordResult = hasValidAdminPassword(password);

  if (passwordResult === null) {
    return NextResponse.json(
      { success: false, error: "ADMIN_PASSWORD_HASH or ADMIN_PASSWORD not configured" },
      { status: 500 },
    );
  }

  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const retryAfter = Math.ceil((attempt.lockedUntil - now) / 1000);
    await appendAuthEvent({ result: "locked", clientId, failedCount: attempt.count });
    return NextResponse.json(
      {
        success: false,
        error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  if (!passwordResult) {
    const nextAttempt: LoginAttempt = {
      count: attempt.count + 1,
      firstAttemptAt: attempt.firstAttemptAt,
    };

    if (nextAttempt.count >= maxFailedAttempts) {
      nextAttempt.lockedUntil = now + lockMs;
    }

    attempts.set(clientId, nextAttempt);
    await appendAuthEvent({ result: "failure", clientId, failedCount: nextAttempt.count });
    return NextResponse.json({ success: false }, { status: 401 });
  }

  attempts.delete(clientId);
  await appendAuthEvent({ result: "success", clientId });
  const response = NextResponse.json({ success: true });
  const csrfToken = crypto.randomBytes(24).toString("base64url");
  response.cookies.set(ADMIN_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
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
  response.cookies.set(CSRF_COOKIE, "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
