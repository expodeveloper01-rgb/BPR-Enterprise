const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const prisma = require("../utils/prisma");
const { signToken } = require("../utils/jwt");
const { sendVerificationEmail } = require("../utils/email");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendToken = (res, user) => {
  const token = signToken(user.id);
  const { password: _pw, verifyCode: _vc, verifyCodeExpires: _vce, ...safeUser } = user;
  return res.json({ user: safeUser, token });
};

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.emailVerified) {
        return res.status(409).json({ message: "Email already registered" });
      }
      // Resend code for existing unverified account
      const code = generateCode();
      const expires = new Date(Date.now() + 15 * 60 * 1000);
      await prisma.user.update({
        where: { email },
        data: { verifyCode: code, verifyCodeExpires: expires },
      });
      await sendVerificationEmail(email, existing.name, code);
      return res.status(200).json({ pendingEmail: email });
    }

    const hashed = await bcrypt.hash(password, 12);
    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        emailVerified: false,
        verifyCode: code,
        verifyCodeExpires: expires,
      },
    });

    await sendVerificationEmail(email, name, code);
    return res.status(200).json({ pendingEmail: email });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Account not found" });
    if (user.emailVerified) return res.status(400).json({ message: "Email already verified" });
    if (!user.verifyCode || user.verifyCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    if (user.verifyCodeExpires < new Date()) {
      return res.status(400).json({ message: "Verification code has expired. Request a new one." });
    }

    const verified = await prisma.user.update({
      where: { email },
      data: { emailVerified: true, verifyCode: null, verifyCodeExpires: null },
    });

    sendToken(res, verified);
  } catch (err) {
    next(err);
  }
};

const resendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Account not found" });
    if (user.emailVerified) return res.status(400).json({ message: "Email already verified" });

    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { email },
      data: { verifyCode: code, verifyCodeExpires: expires },
    });
    await sendVerificationEmail(email, user.name, code);
    return res.json({ message: "Code resent" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email first.", pendingEmail: email });
    }

    sendToken(res, user);
  } catch (err) {
    next(err);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Google credential required" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        user = await prisma.user.update({ where: { id: user.id }, data: { googleId, emailVerified: true } });
      } else {
        user = await prisma.user.create({ data: { name, email, googleId, emailVerified: true } });
      }
    }

    sendToken(res, user);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const { password: _pw, verifyCode: _vc, verifyCodeExpires: _vce, ...safeUser } = req.user;
  res.json({ user: safeUser });
};

module.exports = { register, login, googleAuth, getMe, verifyEmail, resendCode };
