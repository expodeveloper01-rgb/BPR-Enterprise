const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const { query } = require("../utils/prisma");
const { signToken } = require("../utils/jwt");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/email");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendToken = (res, user) => {
  const token = signToken(user.id);
  const {
    password: _pw,
    verifycode: _vc,
    verifyCodeExpires: _vce,
    ...safeUser
  } = user;
  return res.json({ user: safeUser, token });
};

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existingResult = await query(
      'SELECT * FROM "User" WHERE email = $1',
      [email],
    );
    const existing = existingResult.rows[0];

    if (existing) {
      if (existing.emailVerified) {
        return res.status(409).json({ message: "Email already registered" });
      }
      // Resend code for existing unverified account
      const code = generateCode();
      const expires = new Date(Date.now() + 15 * 60 * 1000);
      await query(
        'UPDATE "User" SET "verifyCode" = $1, "verifyCodeExpires" = $2 WHERE email = $3',
        [code, expires, email],
      );
      // Send verification email (non-blocking)
      sendVerificationEmail(email, existing.name, code).catch((err) =>
        console.error(
          `Failed to send verification email to ${email}:`,
          err.message,
        ),
      );
      return res.status(200).json({ pendingEmail: email });
    }

    const hashed = await bcrypt.hash(password, 12);
    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      'INSERT INTO "User" (id, name, email, password, "emailVerified", "verifyCode", "verifyCodeExpires", role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, false, $4, $5, \'user\', NOW(), NOW())',
      [name, email, hashed, code, expires],
    );

    // Send verification email (non-blocking)
    sendVerificationEmail(email, name, code).catch((err) =>
      console.error(
        `Failed to send verification email to ${email}:`,
        err.message,
      ),
    );
    return res.status(200).json({ pendingEmail: email });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });

    const userResult = await query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ message: "Account not found" });
    if (user.emailVerified)
      return res.status(400).json({ message: "Email already verified" });
    if (!user.verifyCode || user.verifyCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    if (user.verifyCodeExpires < new Date()) {
      return res
        .status(400)
        .json({ message: "Verification code has expired. Request a new one." });
    }

    const result = await query(
      'UPDATE "User" SET "emailVerified" = true, "verifyCode" = NULL, "verifyCodeExpires" = NULL, "updatedAt" = NOW() WHERE email = $1 RETURNING *',
      [email],
    );
    const verified = result.rows[0];

    sendToken(res, verified);
  } catch (err) {
    next(err);
  }
};

const resendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const userResult = await query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ message: "Account not found" });
    if (user.emailVerified)
      return res.status(400).json({ message: "Email already verified" });

    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await query(
      'UPDATE "User" SET "verifyCode" = $1, "verifyCodeExpires" = $2, "updatedAt" = NOW() WHERE email = $3',
      [code, expires, email],
    );
    // Send verification email (non-blocking)
    sendVerificationEmail(email, user.name, code).catch((err) =>
      console.error(
        `Failed to send verification email to ${email}:`,
        err.message,
      ),
    );
    return res.json({ message: "Code resent" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const userResult = await query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.emailVerified && user.role !== "admin") {
      return res.status(403).json({
        message: "Please verify your email first.",
        pendingEmail: email,
      });
    }

    sendToken(res, user);
  } catch (err) {
    next(err);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: "Google credential required" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let userResult = await query('SELECT * FROM "User" WHERE "googleId" = $1', [
      googleId,
    ]);
    let user = userResult.rows[0];

    if (!user) {
      const emailResult = await query('SELECT * FROM "User" WHERE email = $1', [
        email,
      ]);
      user = emailResult.rows[0];

      if (user) {
        const updateResult = await query(
          'UPDATE "User" SET "googleId" = $1, "emailVerified" = true, "updatedAt" = NOW() WHERE id = $2 RETURNING *',
          [googleId, user.id],
        );
        user = updateResult.rows[0];
      } else {
        const createResult = await query(
          'INSERT INTO "User" (id, name, email, "googleId", "emailVerified", role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, true, \'user\', NOW(), NOW()) RETURNING *',
          [name, email, googleId],
        );
        user = createResult.rows[0];
      }
    }

    sendToken(res, user);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const {
    password: _pw,
    verifyCode: _vc,
    verifyCodeExpires: _vce,
    ...safeUser
  } = req.user;
  res.json({ user: safeUser });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const userResult = await query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user) {
      // Don't reveal if email exists
      return res
        .status(200)
        .json({ message: "If email exists, reset link sent" });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      'UPDATE "User" SET "resetCode" = $1, "resetCodeExpires" = $2, "updatedAt" = NOW() WHERE email = $3',
      [code, expires, email],
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&code=${code}`;
    // Send password reset email (non-blocking)
    sendPasswordResetEmail(email, user.name, resetLink).catch((err) =>
      console.error(
        `Failed to send password reset email to ${email}:`,
        err.message,
      ),
    );

    return res
      .status(200)
      .json({ message: "If email exists, reset link sent" });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, code, and password are required" });
    }

    const userResult = await query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ message: "Account not found" });

    if (!user.resetCode || user.resetCode !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    const result = await query(
      'UPDATE "User" SET password = $1, "resetCode" = NULL, "resetCodeExpires" = NULL, "updatedAt" = NOW() WHERE email = $2 RETURNING *',
      [hashed, email],
    );
    const updated = result.rows[0];

    sendToken(res, updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  verifyEmail,
  resendCode,
  forgotPassword,
  resetPassword,
};
