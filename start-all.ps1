# ShebaXpert Application Startup Script
# This script starts the complete ShebaXpert application with MySQL authentication

Write-Host "=== ShebaXpert Application Startup ===" -ForegroundColor Cyan
Write-Host "Starting all services..." -ForegroundColor Green

# Check if required dependencies are available
Write-Host "Checking dependencies..." -ForegroundColor Yellow

# Check for Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check for Python
try {
    $pythonVersion = python --version
    Write-Host "[OK] Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python not found. Please install Python" -ForegroundColor Red
    exit 1
}

# Check if backend dependencies are installed
if (!(Test-Path "i:\ShebaXpert\backend\node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location "i:\ShebaXpert\backend"
    npm install
}

# Check if .env file exists
if (!(Test-Path "i:\ShebaXpert\backend\.env")) {
    Write-Host "[WARNING] .env file not found in backend directory" -ForegroundColor Yellow
    Write-Host "Please ensure MySQL credentials are configured" -ForegroundColor Yellow
}

# Kill any existing processes on our ports
Write-Host "Stopping any existing services..." -ForegroundColor Yellow
try {
    Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*8080*"} | Stop-Process -Force
    Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -like "*server.js*"} | Stop-Process -Force
} catch {
    # Ignore errors if processes don't exist
}

Write-Host "Starting services..." -ForegroundColor Green

# 1. Start the static file server for the frontend (port 8080)
Write-Host "Starting frontend server on http://localhost:8080..." -ForegroundColor Cyan
Start-Process python -ArgumentList '-m', 'http.server', '8080' -WorkingDirectory 'i:\ShebaXpert' -WindowStyle Minimized

Start-Sleep -Seconds 3 # Give the static server time to start

# 2. Start the backend API server (port 5000)
Write-Host "Starting backend API server on http://localhost:5000..." -ForegroundColor Cyan
Start-Process node -ArgumentList 'server.js' -WorkingDirectory 'i:\ShebaXpert\backend' -WindowStyle Minimized

Start-Sleep -Seconds 3 # Give the backend time to start

# 3. Open the application in the default browser
Write-Host "Opening ShebaXpert application..." -ForegroundColor Green
Start-Process "http://localhost:8080/Landing%20Page/LandingPage.html"

Write-Host "" -ForegroundColor White
Write-Host "=== ShebaXpert Application Started Successfully ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Landing Page: http://localhost:8080/Landing%20Page/LandingPage.html" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "To stop all services, close this PowerShell window or press Ctrl+C" -ForegroundColor Yellow
Write-Host "=== Services Running ===" -ForegroundColor Green

# Keep the script running to show the status
try {
    while ($true) {
        Start-Sleep -Seconds 30
        Write-Host "Services still running... $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor DarkGreen
    }
} catch {
    Write-Host "Shutting down services..." -ForegroundColor Yellow
}
