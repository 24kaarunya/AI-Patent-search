@echo off
echo ===================================================
echo   Starting Patent AI Search Assistant Full Stack
echo ===================================================

echo [1/2] Launching Node.js Express Server (Port 5000)...
start cmd /k "cd server && npm start"

echo [2/2] Launching Python FastAPI AI Service (Port 8000)...
start cmd /k "cd ai_service && uvicorn main:app --host 127.0.0.1 --port 8000"

echo Wait 3 seconds for servers to initialize...
timeout /t 3 >nul

echo Opening browser to Single URL: http://localhost:5000...
start http://localhost:5000

echo ===================================================
echo Services have been launched.
echo Frontend + Express API URL: http://localhost:5000
echo FastAPI AI Service:         http://127.0.0.1:8000/
echo ===================================================
pause
