import connectDB from "../../lib/mongodb.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendVerificationLink } from "../../utils/email.utils.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function pushAudit(user, action, req) {
  try { const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; const ua = req.headers["user-agent"] || ""; user.verificationAudit = user.verificationAudit || []; user.verificationAudit.push({ action, ip, userAgent: ua, timestamp: new Date() }); if (user.verificationAudit.length > 50) user.verificationAudit.shift(); await user.save(); } catch (err) { console.error(err); }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.emailVerification.verified) return res.status(400).json({ success: false, message: "Already verified" });

  const now = Date.now();
  const COOLDOWN_MS = 60 * 1000;
  const WINDOW_MS = 60 * 60 * 1000;
  const MAX_RESENDS = 3;

  if (user.lastResendAt && (now - new Date(user.lastResendAt).getTime()) > WINDOW_MS) {
    user.resendCount = 0;
    user.lastResendAt = null;
  }

  if (user.lastResendAt && (now - new Date(user.lastResendAt).getTime()) < COOLDOWN_MS)
    return res.status(429).json({ success: false, message: "Please wait 1 min before retrying" });
  if (user.resendCount >= MAX_RESENDS)
    return res.status(429).json({ success: false, message: "Max resend attempts reached" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "10m" });
  const sent = await sendVerificationLink(user.email, user.name, token);
  user.resendCount += 1;
  user.lastResendAt = new Date();
  await user.save();

  await pushAudit(user, sent ? "verification-email-resent" : "verification-email-resend-failed", req);

  return sent ? res.status(200).json({ success: true, message: "Verification email resent" }) : res.status(500).json({ success: false, message: "Failed to resend" });
}