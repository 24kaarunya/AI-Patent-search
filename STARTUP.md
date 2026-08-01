# Patent AI Search Assistant - Startup Guide

This document explains how to start the Patent AI Search Assistant as a single-URL deployment.

---

## Architecture Stack

1. **Frontend + Express Server (Port 5000)**: Serves static compiled React build assets and processes REST APIs (Authentication, database records, search histories, bookmarks).
2. **Python FastAPI AI Core (Port 8000)**: Computes semantic Sentence Transformer embeddings, FAISS vector matches, and LLM prior-art comparison summaries.

---

## The Easiest Way to Run (Windows)

Double-click or run the batch script at the project root folder:
```powershell
.\run_project.bat
```
This script automatically starts both backend servers and opens your default web browser to [http://localhost:5000](http://localhost:5000).

---

## Manual Step-by-Step Run

### 1. Build client static files (optional, already compiled)
```bash
npm run build
```
This updates the build assets in `dist/`.

### 2. Start the Node.js Express Server
Navigate to the `server/` directory and start the server:
```bash
cd server
npm start
```
*Note: The Express server automatically checks for a local MongoDB service. If MongoDB is offline, it falls back to storing data locally in `server/data/local_db.json` so you do not need to configure anything.*

### 3. Start the Python AI Core Service
Navigate to the `ai_service/` directory and run the FastAPI server:
```bash
cd ai_service
uvicorn main:app --host 127.0.0.1 --port 8000
```

Once both servers are running, access the application at:
👉 **[http://localhost:5000](http://localhost:5000)**
