@echo off
title ShebaXpert Authentication Server
color 0A

echo ===================================
echo    ShebaXpert Authentication Server
echo ===================================
echo.

cd /d "i:\ShebaXpert\backend"

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [2/4] Node.js version:
node --version

echo.
echo [3/4] Installing/checking dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo [4/4] Starting authentication server...
echo.
echo Server will be available at: http://localhost:5000
echo Health check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo ===================================
echo.

timeout /t 3 /nobreak >nul

REM Start browser to show server is running
start "" "http://localhost:5000/api/health"

REM Start the server
node test-auth-server.js

echo.
echo Server stopped.
pause
