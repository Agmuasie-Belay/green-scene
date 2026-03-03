import connectDB from "../../lib/mongodb.js";
import User from "../../models/user.model.js";

async function pushAudit(user, action, req, extra = {}) {
  try { const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; const ua = req.headers["user-agent"] || ""; user.verificationAudit = user.verificationAudit || []; user.verificationAudit.push({ action, ip, userAgent: ua, timestamp: new Date(), ...extra }); if (user.verificationAudit.length > 50) user.verificationAudit.shift(); await user.save(); } catch (err) { console.error(err); }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  const { userId, code } = req.body;
  if (!userId || !code) return res.status(400).json({ success: false, message: "User ID and code required" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.phoneVerification.verified) return res.status(400).json({ success: false, message: "Already verified" });

  const isCodeValid = user.phoneVerification.code === code.toString() && user.phoneVerification.expiresAt > new Date();
  if (!isCodeValid) { await pushAudit(user, "phone-verification-failed", req, { providedCode: code }); return res.status(400).json({ success: false, message: "Invalid or expired code" }); }

  user.phoneVerification.verified = true;
  user.phoneVerification.code = undefined;
  user.phoneVerification.expiresAt = undefined;
  user.canUploadDocuments = true;
  await user.save();
  await pushAudit(user, "phone-verification-success", req);

  return res.status(200).json({ success: true, message: "Phone verified successfully" });
}