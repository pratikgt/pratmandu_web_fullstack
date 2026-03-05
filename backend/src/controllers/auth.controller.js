import bcrypt from "bcrypt";
import * as UserModule from "../models/User.js";
import { signToken } from "../utils/tokens.js";

const User = UserModule.default || UserModule.User;

export async function register(req, res) {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "fullname, email, password required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname: fullname.trim(),
      email: cleanEmail,
      passwordHash,
      role: "user",
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Register failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email, password required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("_id fullname email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Me failed" });
  }
}