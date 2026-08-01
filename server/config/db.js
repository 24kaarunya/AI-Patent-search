import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const LOCAL_DB_PATH = path.resolve("server/data/local_db.json");

// Hashing passwords helper fallback
export function mockHash(password) {
  // Simple Base64 + reverse hash for local file DB if bcrypt is slow
  return btoa(password.split("").reverse().join(""));
}

function loadLocalData() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    let initialPatents = [];
    try {
      const patentsPath = path.resolve("server/data/patentData.json");
      initialPatents = JSON.parse(fs.readFileSync(patentsPath, "utf8"));
    } catch (e) {
      console.warn("Failed to load initial patents from patentData.json:", e.message);
    }
    const initialDb = {
      users: [
        {
          email: "admin@patentai.com",
          passwordHash: mockHash("Admin@123"),
          name: "Director Alexander",
          role: "Admin",
          created: new Date("2026-01-10").toISOString(),
          bio: "Principal patent compliance administrator.",
          status: "Active"
        },
        {
          email: "user@patentai.com",
          passwordHash: mockHash("User@1234"),
          name: "Dr. Jane Doe",
          role: "User",
          created: new Date("2026-02-15").toISOString(),
          bio: "Senior IoT & Embedded Systems researcher.",
          status: "Active"
        }
      ],
      searchHistory: [],
      savedPatents: {}, // { email: [patentIds] }
      customPatents: initialPatents
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
  } catch (e) {
    return {};
  }
}

function saveLocalData(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

let isUsingMongoDB = false;

export async function connectDB() {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/patent_ai";
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 
    });
    console.log("🚀 Connected successfully to MongoDB");
    isUsingMongoDB = true;
  } catch (err) {
    console.warn("⚠️ MongoDB connection failed. Falling back to local file database:", LOCAL_DB_PATH);
    isUsingMongoDB = false;
    loadLocalData(); 
  }
}

export const localDB = {
  isLocal() {
    return !isUsingMongoDB;
  },
  
  getCollection(name) {
    const data = loadLocalData();
    return data[name] || [];
  },
  
  saveCollection(name, collection) {
    const data = loadLocalData();
    data[name] = collection;
    saveLocalData(data);
  }
};
