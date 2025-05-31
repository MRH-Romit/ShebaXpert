# ShebaXpert Authentication Server PowerShell Launcher
param(
    [switch]$NoBrowser
)

$Host.UI.RawUI.WindowTitle = "ShebaXpert Authentication Server"

Write-Host "====================================" -ForegroundColor Green
Write-Host "  ShebaXpert Authentication Server" -ForegroundColor Green  
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Change to backend directory
$backendPath = "i:\ShebaXpert\backend"
Set-Location $backendPath

Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Installing/checking dependencies..." -ForegroundColor Yellow

try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Checking database connectivity..." -ForegroundColor Yellow

# Test database connection
try {
    $dbTest = node -e "const db = require('./DatabaseManager'); db.testConnection().then(r => console.log(r ? 'OK' : 'FAIL')).catch(() => console.log('FAIL'))"
    if ($dbTest -eq "OK") {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database connection failed, using SQLite fallback" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Database check failed, continuing with SQLite fallback" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/4] Starting authentication server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Server will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🏥 Health check: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host "📝 API documentation: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Wait a moment then open browser
Start-Sleep -Seconds 2

if (-not $NoBrowser) {
    Write-Host "🌐 Opening browser..." -ForegroundColor Gray
    Start-Process "http://localhost:5000/api/health"
}

# Start the server
try {
    Write-Host "🔄 Starting server process..." -ForegroundColor Gray
    node test-auth-server.js
} catch {
    Write-Host ""
    Write-Host "❌ Server failed to start" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}
