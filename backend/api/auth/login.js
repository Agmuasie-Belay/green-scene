import connectDB from "../../lib/mongodb.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) return res.status(400).json({ success: false, message: "Email/Phone and password required" });

    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    if (!user.emailVerification.verified && !user.phoneVerification.verified)
      return res.status(403).json({ success: false, message: "Please verify your account first" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, visionStatement: user.visionStatement } });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}