import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { localDB, mockHash } from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "patent_ai_secret_key_jwt";

// Helper to encrypt passwords
async function hashPassword(pwd) {
  if (localDB.isLocal()) {
    return mockHash(pwd);
  }
  try {
    return await bcryptjs.hash(pwd, 10);
  } catch (e) {
    return mockHash(pwd);
  }
}

async function comparePassword(pwd, hashed) {
  if (localDB.isLocal()) {
    return mockHash(pwd) === hashed;
  }
  try {
    return await bcryptjs.compare(pwd, hashed);
  } catch (e) {
    return mockHash(pwd) === hashed;
  }
}

// User Schema for Mongoose
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "User" },
  status: { type: String, default: "Active" },
  bio: { type: String, default: "R&D Inventor" },
  created: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Middleware to verify JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Access token missing." });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.userPayload = decoded;
    next();
  });
}

// Routes
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  
  const targetEmail = email.toLowerCase();
  try {
    if (localDB.isLocal()) {
      const users = localDB.getCollection("users");
      if (users.some(u => u.email === targetEmail)) {
        return res.status(400).json({ message: "User email already registered." });
      }
      const newU = {
        email: targetEmail,
        passwordHash: await hashPassword(password),
        name,
        role: "User",
        status: "Active",
        bio: "R&D Inventor",
        created: new Date().toISOString()
      };
      users.push(newU);
      localDB.saveCollection("users", users);
      
      const token = jwt.sign({ email: newU.email, role: newU.role }, JWT_SECRET, { expiresIn: "24h" });
      return res.json({ token, user: { email: newU.email, name: newU.name, role: newU.role, bio: newU.bio, created: newU.created, status: newU.status } });
    } else {
      const existing = await User.findOne({ email: targetEmail });
      if (existing) return res.status(400).json({ message: "User email already registered." });
      
      const hashed = await hashPassword(password);
      const newUser = new User({ email: targetEmail, passwordHash: hashed, name });
      await newUser.save();
      
      const token = jwt.sign({ email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "24h" });
      return res.json({ token, user: { email: newUser.email, name: newUser.name, role: newUser.role, bio: newUser.bio, created: newUser.created, status: newUser.status } });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required." });
  
  const targetEmail = email.toLowerCase();
  try {
    let user;
    if (localDB.isLocal()) {
      const users = localDB.getCollection("users");
      user = users.find(u => u.email === targetEmail);
    } else {
      user = await User.findOne({ email: targetEmail });
    }
    
    if (!user) return res.status(400).json({ message: "Invalid email or password." });
    if (user.status === "Inactive") return res.status(403).json({ message: "This account has been deactivated by the administrator." });
    
    const matches = await comparePassword(password, user.passwordHash);
    if (!matches) return res.status(400).json({ message: "Invalid email or password." });
    
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token, user: { email: user.email, name: user.name, role: user.role, bio: user.bio, created: user.created, status: user.status } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  const email = req.userPayload.email;
  try {
    let user;
    if (localDB.isLocal()) {
      user = localDB.getCollection("users").find(u => u.email === email);
    } else {
      user = await User.findOne({ email });
    }
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user: { email: user.email, name: user.name, role: user.role, bio: user.bio, created: user.created, status: user.status } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/profile/update", authenticateToken, async (req, res) => {
  const email = req.userPayload.email;
  const { name, bio } = req.body;
  try {
    if (localDB.isLocal()) {
      const users = localDB.getCollection("users");
      const idx = users.findIndex(u => u.email === email);
      if (idx === -1) return res.status(404).json({ message: "User not found." });
      users[idx].name = name;
      users[idx].bio = bio;
      localDB.saveCollection("users", users);
      return res.json({ user: users[idx] });
    } else {
      const updated = await User.findOneAndUpdate({ email }, { name, bio }, { new: true });
      return res.json({ user: updated });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Admin management APIs
router.get("/users", authenticateToken, async (req, res) => {
  if (req.userPayload.role !== "Admin") return res.status(403).json({ message: "Admin access required." });
  try {
    let users;
    if (localDB.isLocal()) {
      users = localDB.getCollection("users");
    } else {
      users = await User.find({});
    }
    const cleanUsers = users.map(u => ({ email: u.email, name: u.name, role: u.role, created: u.created, bio: u.bio, status: u.status || "Active" }));
    return res.json(cleanUsers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/users/status", authenticateToken, async (req, res) => {
  if (req.userPayload.role !== "Admin") return res.status(403).json({ message: "Admin access required." });
  const { email, status } = req.body;
  try {
    if (localDB.isLocal()) {
      const users = localDB.getCollection("users");
      const idx = users.findIndex(u => u.email === email);
      if (idx === -1) return res.status(404).json({ message: "User not found." });
      users[idx].status = status;
      localDB.saveCollection("users", users);
      return res.json({ success: true });
    } else {
      await User.findOneAndUpdate({ email }, { status });
      return res.json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/users/role", authenticateToken, async (req, res) => {
  if (req.userPayload.role !== "Admin") return res.status(403).json({ message: "Admin access required." });
  const { email, role } = req.body;
  try {
    if (localDB.isLocal()) {
      const users = localDB.getCollection("users");
      const idx = users.findIndex(u => u.email === email);
      if (idx === -1) return res.status(404).json({ message: "User not found." });
      users[idx].role = role;
      localDB.saveCollection("users", users);
      return res.json({ success: true });
    } else {
      await User.findOneAndUpdate({ email }, { role });
      return res.json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:email", authenticateToken, async (req, res) => {
  if (req.userPayload.role !== "Admin") return res.status(403).json({ message: "Admin access required." });
  const email = req.params.email;
  try {
    if (localDB.isLocal()) {
      const users = localDB.getCollection("users");
      const filtered = users.filter(u => u.email !== email);
      localDB.saveCollection("users", filtered);
      return res.json({ success: true });
    } else {
      await User.findOneAndDelete({ email });
      return res.json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
