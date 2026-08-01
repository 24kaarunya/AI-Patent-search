import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import inventionRoutes from "./routes/invention.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Bind routes
app.use("/api/auth", authRoutes);
app.use("/api/invention", inventionRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Serve static assets from Vite production build
app.use(express.static(distPath));

// Catch-all to serve index.html for React Router compatibility
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found." });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

// Seed default users & patents if collection is empty
async function seedDatabase() {
  try {
    const db = mongoose.connection;
    if (db.readyState !== 1) return; // not connected
    
    // Seed Users
    const usersColl = db.collection("users");
    const userCount = await usersColl.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Seeding default users to MongoDB...");
      const adminHash = await bcryptjs.hash("Admin@123", 10);
      const userHash = await bcryptjs.hash("User@1234", 10);
      await usersColl.insertMany([
        {
          email: "admin@patentai.com",
          passwordHash: adminHash,
          name: "Director Alexander",
          role: "Admin",
          created: new Date("2026-01-10"),
          bio: "Principal patent compliance administrator.",
          status: "Active"
        },
        {
          email: "user@patentai.com",
          passwordHash: userHash,
          name: "Dr. Jane Doe",
          role: "User",
          created: new Date("2026-02-15"),
          bio: "Senior IoT & Embedded Systems researcher.",
          status: "Active"
        }
      ]);
      console.log("✅ Seeding users completed.");
    }
    
    // Seed Patents
    const patentsColl = db.collection("patents");
    const patentCount = await patentsColl.countDocuments();
    if (patentCount === 0) {
      console.log("🌱 Seeding initial patents to MongoDB...");
      const patentsPath = path.resolve(__dirname, "data/patentData.json");
      if (fs.existsSync(patentsPath)) {
        const patents = JSON.parse(fs.readFileSync(patentsPath, "utf8"));
        await patentsColl.insertMany(patents);
        console.log(`✅ Seeding ${patents.length} patents completed.`);
      }
    }
  } catch (err) {
    console.warn("⚠️ MongoDB seeding warning:", err.message);
  }
}

// Run server
async function startServer() {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
  });
}

startServer();
