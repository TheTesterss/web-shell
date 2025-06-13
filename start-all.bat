@echo off
echo Starting Go backend...
start "" cmd /k "cd backend && go run main.go"

::echo Starting React web frontend (dev server)...
::start "" cmd /k "cd frontend && npm run dev"

echo Building React frontend for Electron...
call cd frontend && npm run build
call cd ..

echo Waiting for web frontend to be ready (http://localhost:5173)...
timeout /t 10 /nobreak > NUL
echo Web frontend is ready. Starting Electron desktop app...

start "" cmd /k "electron desktop"

echo All services launched. Close console windows to stop services.
pause