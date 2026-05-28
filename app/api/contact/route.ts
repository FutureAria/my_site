import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactAttempt = {
  count: number;
  firstAttemptAt: number;
};

const attempts = new Map<string, ContactAttempt>();
const windowMs = 10 * 60 * 1000;
const maxAttempts = 3;

function getClientId(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(clientId: string) {
  const now = Date.now();
  const previous = attempts.get(clientId);

  if (!previous || now - previous.firstAttemptAt > windowMs) {
    attempts.set(clientId, { count: 1, firstAttemptAt: now });
    return false;
  }

  const next = { ...previous, count: previous.count + 1 };
  attempts.set(clientId, next);
  return next.count > maxAttempts;
}

function cleanText(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 120;
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = cleanText(body.name, 60);
  const email = cleanText(body.email, 120);
  const message = cleanText(body.message, 2000);
  const website = cleanText(body.website, 200);

  if (website) {
    return NextResponse.json({ success: true });
  }

  if (isRateLimited(getClientId(request))) {
    return NextResponse.json(
      { success: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "모든 필드를 입력해주세요." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "이메일 형식을 확인해주세요." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ success: false, error: "메시지를 10자 이상 입력해주세요." }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO;

  if (!smtpHost || !smtpUser || !smtpPass || !contactTo) {
    // SMTP 미설정 시 mailto 링크로 안내
    return NextResponse.json({ success: false, error: "SMTP_NOT_CONFIGURED" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"${name}" <${smtpUser}>`,
    to: contactTo,
    replyTo: email,
    subject: `[포트폴리오 문의] ${name}님이 메시지를 보냈습니다`,
    text: `이름: ${name}\n이메일: ${email}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#3b82f6;">포트폴리오 문의</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;width:80px;">이름</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">이메일</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#3b82f6;">${escapeHtml(email)}</a></td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
