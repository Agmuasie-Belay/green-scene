import connectDB from "../../lib/mongodb.js";
import User from "../../models/user.model.js";
import crypto from "crypto";
import { sendEmail } from "../../utils/email.utils.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

async function pushAudit(user, action, req) {
  try { const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; const ua = req.headers["user-agent"] || ""; user.verificationAudit = user.verificationAudit || []; user.verificationAudit.push({ action, ip, userAgent: ua, timestamp: new Date() }); if (user.verificationAudit.length > 50) user.verificationAudit.shift(); await user.save(); } catch (err) { console.error(err); }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ success: true, message: "If an account exists, a reset email has been sent." });

  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(user.email, "Password Reset Request", `Reset your password here: ${resetLink}`);
  await pushAudit(user, "password-reset-link-sent", req);

  return res.status(200).json({ success: true, message: "If an account exists, a password reset email has been sent." });
}