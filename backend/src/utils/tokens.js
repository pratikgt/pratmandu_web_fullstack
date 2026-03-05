import jwt from "jsonwebtoken";

export function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  return jwt.sign(
    { id: String(user._id), role: user.role || "user" },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}