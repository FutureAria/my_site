import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "모든 필드를 입력해주세요." }, { status: 400 });
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
          <tr><td style="padding:8px 0;color:#6b7280;width:80px;">이름</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">이메일</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#3b82f6;">${email}</a></td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;white-space:pre-wrap;">${message}</div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
