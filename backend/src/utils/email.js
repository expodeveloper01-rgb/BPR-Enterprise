const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(to, name, code) {
  await transporter.sendMail({
    from: `"Uncle Brew Cebu" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Your Uncle Brew verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
        <img src="${process.env.FRONTEND_URL}/assets/img/uncle-brew.png" alt="Uncle Brew" style="width:80px;margin-bottom:24px" />
        <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Verify your email</h2>
        <p style="color:#6b7280;font-size:15px;margin:0 0 24px">Hi ${name}, enter this code to complete your registration:</p>
        <div style="letter-spacing:12px;font-size:36px;font-weight:800;color:#111827;background:#f3f4f6;border-radius:8px;padding:16px 24px;display:inline-block;margin-bottom:24px">${code}</div>
        <p style="color:#9ca3af;font-size:13px;margin:0">This code expires in <strong>15 minutes</strong>. If you didn't sign up, ignore this email.</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(to, name, resetLink) {
  await transporter.sendMail({
    from: `"Uncle Brew Cebu" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Reset your Uncle Brew password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
        <img src="${process.env.FRONTEND_URL}/assets/img/uncle-brew.png" alt="Uncle Brew" style="width:80px;margin-bottom:24px" />
        <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Reset your password</h2>
        <p style="color:#6b7280;font-size:15px;margin:0 0 24px">Hi ${name}, click the link below to reset your password:</p>
        <a href="${resetLink}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;margin-bottom:24px">Reset Password</a>
        <p style="color:#9ca3af;font-size:13px;margin:0">This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
