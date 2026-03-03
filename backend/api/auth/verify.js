import connectDB from "../../lib/mongodb.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

async function pushAudit(user, action, req) {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ua = req.headers["user-agent"] || "";
    user.verificationAudit = user.verificationAudit || [];
    user.verificationAudit.push({ action, ip, userAgent: ua, timestamp: new Date() });
    if (user.verificationAudit.length > 50) user.verificationAudit.shift();
    await user.save();
  } catch (err) { console.error("Audit log error:", err.message); }
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");
  await connectDB();

  const { token } = req.query;
  if (!token) return res.redirect(`${FRONTEND_URL}/verify-failed`);

  let payload;
  try { payload = jwt.verify(token, JWT_SECRET); }
  catch { return res.redirect(`${FRONTEND_URL}/verify-failed`); }

  const user = await User.findById(payload.id);
  if (!user) return res.redirect(`${FRONTEND_URL}/verify-failed`);

  if (!user.emailVerification.verified) {
    user.emailVerification.verified = true;
    user.emailVerification.code = undefined;
    user.emailVerification.expiresAt = undefined;
    user.canUploadDocuments = true;
    user.resendCount = 0;
    user.lastResendAt = null;
    await user.save();
    await pushAudit(user, "email-verification-success", req);
  } else {
    await pushAudit(user, "email-verification-already", req);
  }

  return res.redirect(`${FRONTEND_URL}/login`);
}