import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Patent Schema
const patentSchema = new mongoose.Schema({
  id: String,
  patentNumber: String,
  title: String,
  abstract: String,
  description: String,
  claims: [String],
  inventors: [String],
  assignee: String,
  filingDate: String,
  publicationDate: String,
  classification: String,
  ipcCode: String,
  status: String,
  source: String,
  sourceUrl: String,
  features: [String],
  components: [String],
  functions: [String]
});

const Patent = mongoose.models.Patent || mongoose.model("Patent", patentSchema);

const techNouns = ["Sensor Array", "Controller Controller", "Neural Network", "Feedback Loop", "Transceiver", "Data Pipeline", "Cryptographic Module", "Actuator Node", "Telemetry Link"];
const techAdjectives = ["Distributed", "Decentralized", "Predictive", "Adaptive", "Cognitive", "Encrypted", "Fault-Tolerant", "High-Throughput", "Resilient"];
const techDomains = [
  { name: "IoT + AI", ipc: "G06F 15/18" },
  { name: "Renewable Energy", ipc: "Y02E 10/50" },
  { name: "IoT + Agriculture", ipc: "A01G 25/16" },
  { name: "Wearables + AR", ipc: "H04N 13/00" },
  { name: "Cybersecurity + AI", ipc: "H04L 9/32" },
  { name: "Biotech + Genomics", ipc: "C12N 15/11" },
  { name: "Blockchain + FinTech", ipc: "G06Q 20/38" },
  { name: "Autonomous Vehicles", ipc: "B60W 30/00" }
];
const assignees = ["Nova Research Lab", "Aether Robotics", "Apex Energy Corp", "Helix Bio-Systems", "Quantum Shield Inc", "Terran Ag-Tech", "Zenith Mobility", "Synapse Software"];
const inventorsList = ["Sarah Jenkins", "Hiroshi Tanaka", "Mateo Silva", "Amina Diop", "Li Wei", "Elena Petrova", "John McCourt", "Sophia Martinez", "Kavitha Patel", "David Vance"];

function generatePatents(count) {
  const patents = [];
  for (let i = 1; i <= count; i++) {
    const domainObj = techDomains[i % techDomains.length];
    // Distribute source (60% USPTO, 30% EPO, 10% WIPO)
    const source = i % 10 < 6 ? "USPTO" : (i % 10 < 9 ? "EPO" : "WIPO");
    let patNum = "";
    let url = "";
    if (source === "USPTO") {
      patNum = `US-${Math.floor(10000000 + Math.random() * 90000000)}-B2`;
      url = `https://patents.google.com/patent/${patNum.replace(/-/g, "")}/en`;
    } else if (source === "EPO") {
      patNum = `EP-${Math.floor(1000000 + Math.random() * 9000000)}-A1`;
      url = `https://patents.google.com/patent/${patNum.replace(/-/g, "")}/en`;
    } else {
      patNum = `WO-2025-${Math.floor(100000 + Math.random() * 900000)}-A2`;
      url = `https://patents.google.com/patent/${patNum.replace(/-/g, "")}/en`;
    }

    const adj1 = techAdjectives[Math.floor(Math.random() * techAdjectives.length)];
    const noun1 = techNouns[Math.floor(Math.random() * techNouns.length)];
    const adj2 = techAdjectives[Math.floor(Math.random() * techAdjectives.length)];
    const noun2 = techNouns[Math.floor(Math.random() * techNouns.length)];
    
    const title = `${adj1} ${noun1} for ${adj2} ${noun2} Management`;
    const assignee = assignees[Math.floor(Math.random() * assignees.length)];
    
    const invs = [];
    while (invs.length < 2) {
      const name = inventorsList[Math.floor(Math.random() * inventorsList.length)];
      if (!invs.includes(name)) invs.push(name);
    }
    
    const filingYear = 2022 + Math.floor(Math.random() * 3);
    const filingMonth = 1 + Math.floor(Math.random() * 12);
    const filingDay = 1 + Math.floor(Math.random() * 28);
    const pubYear = filingYear + 1;
    
    const fDate = `${filingYear}-${String(filingMonth).padStart(2, "0")}-${String(filingDay).padStart(2, "0")}`;
    const pDate = `${pubYear}-${String((filingMonth + 6) % 12 + 1).padStart(2, "0")}-${String(filingDay).padStart(2, "0")}`;

    patents.push({
      id: `pat_${String(i).padStart(4, "0")}`,
      patentNumber: patNum,
      title: title,
      abstract: `This patent details a ${adj1.toLowerCase()} method and system to optimize ${noun1.toLowerCase()} interactions. By integrating a ${adj2.toLowerCase()} ${noun2.toLowerCase()} logic layer, the device achieves high reliability, low energy consumption, and high operational safety under complex distributed conditions.`,
      description: `Detailed description of the embodiment containing ${adj1.toLowerCase()} components coupled with a ${noun1.toLowerCase()} stack. The design utilizes modern low-power protocols and advanced vector operations to process feedback loops in real time, preventing sensor collision or security breaches in the underlying framework.`,
      claims: [
        `1. An apparatus comprising a ${adj1.toLowerCase()} ${noun1.toLowerCase()} coupled with a ${adj2.toLowerCase()} controller.`,
        `2. The system of claim 1, further comprising a wireless link for remote diagnostics and telemetry broadcasts.`
      ],
      inventors: invs,
      assignee: assignee,
      filingDate: fDate,
      publicationDate: pDate,
      classification: domainObj.name,
      ipcCode: domainObj.ipc,
      status: "Active",
      source: source,
      sourceUrl: url,
      features: [adj1, noun1, adj2, noun2],
      components: [noun1, noun2, "Processing Core"],
      functions: ["Parameter tuning", "Telemetry telemetry", "Adaptive regulation"]
    });
  }
  return patents;
}

async function run() {
  console.log("Generating 1000 patents...");
  const patents = generatePatents(1000);
  
  // 1. Update patentData.json file
  const jsonPath = path.resolve(__dirname, "../data/patentData.json");
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(patents, null, 2), "utf8");
    console.log(`✅ Saved 1000 patents to fallback file: ${jsonPath}`);
  } catch (err) {
    console.error("Failed to save JSON fallback file:", err.message);
  }

  // 2. Update MongoDB if available
  try {
    await connectDB();
    const db = mongoose.connection;
    if (db.readyState === 1) {
      console.log("Connected to MongoDB. Purging old collection...");
      const patentsColl = db.collection("patents");
      await patentsColl.deleteMany({});
      console.log("Seeding 1000 patents into MongoDB...");
      await patentsColl.insertMany(patents);
      console.log("✅ Seeded 1000 patents successfully to MongoDB!");
    } else {
      console.log("MongoDB not active. Skipping MongoDB seeding.");
    }
  } catch (err) {
    console.log("MongoDB connection error or skipped seeding:", err.message);
  } finally {
    mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  }
}

run();
