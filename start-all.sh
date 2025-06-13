#!/bin/bash

echo "Starting Go backend..."
cd backend && go run main.go &
GO_PID=$!
cd ..

#echo "Starting React web frontend (dev server)..."
#cd frontend && npm start &
#FRONTEND_WEB_PID=$!
#cd ..

echo "Building React frontend for Electron..."
cd frontend && npm run build
cd ..

echo "Waiting for web frontend to be ready (http://localhost:5173)..."
while ! curl -s http://localhost:5173 > /dev/null; do
  sleep 1
done
echo "Web frontend is ready. Starting Electron desktop app..."

electron desktop &
ELECTRON_PID=$!

echo "All services launched. Press Ctrl+C to stop all."

cleanup() {
  echo "Stopping all services..."
  kill $GO_PID
  #kill $FRONTEND_WEB_PID
  kill $ELECTRON_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

wait