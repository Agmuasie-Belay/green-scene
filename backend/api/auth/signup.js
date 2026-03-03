import connectDB from "../../lib/mongodb.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationLink } from "../../utils/email.utils.js";

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;
const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

async function pushAudit(user, action, req, extra = {}) {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ua = req.headers["user-agent"] || "";
    user.verificationAudit = user.verificationAudit || [];
    user.verificationAudit.push({ action, ip, userAgent: ua, timestamp: new Date(), ...extra });
    if (user.verificationAudit.length > 50) user.verificationAudit.shift();
    await user.save();
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
}

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  try {
    const { name, email, phone, password, role, visionStatement } = req.body;

    if (!name || !password || !role || (!email && !phone))
      return res.status(400).json({ success: false, message: "Required fields missing" });

    if (!["student", "tutor"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role" });
    if (email && !emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid email" });
    if (phone && !phoneRegex.test(phone)) return res.status(400).json({ success: false, message: "Invalid phone number" });
    if (!isValidPassword(password)) return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include letters and numbers" });
    if (role === "student" && (!visionStatement || visionStatement.length < 50))
      return res.status(400).json({ success: false, message: "Vision statement must be at least 50 characters" });

    if (email && await User.findOne({ email })) return res.status(400).json({ success: false, message: "Email already in use" });
    if (phone && await User.findOne({ phone })) return res.status(400).json({ success: false, message: "Phone already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const userPayload = { name, email, phone, passwordHash, role, visionStatement: role === "student" ? visionStatement : undefined, emailVerification: { verified: false }, phoneVerification: { verified: false }, canUploadDocuments: false, resendCount: 0, lastResendAt: null, verificationAudit: [] };

    if (!email && phone) {
      userPayload.phoneVerification.code = generateVerificationCode();
      userPayload.phoneVerification.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    }

    const newUser = await User.create(userPayload);
    await pushAudit(newUser, "signup", req, { note: "user created (unverified)" });

    let fallbackLink = null;

    if (email) {
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "10m" });
      const { sent, fallbackVerificationLink } = await sendVerificationLink(email, name, newUser._id);
      fallbackLink = fallbackVerificationLink;
      await pushAudit(newUser, sent ? "verification-email-sent" : "verification-email-failed", req);
    } else {
      console.log("Phone verification code:", newUser.phoneVerification.code);
      await pushAudit(newUser, "phone-verification-code-created", req);
    }

    return res.status(201).json({ success: true, message: email ? "Signup successful. Please verify your email." : "Signup successful. Please verify your phone number.", data: { id: newUser._id, email, phone, role: newUser.role }, fallbackVerificationLink: fallbackLink });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default allowCors(handler);