# ShebaXpert Backend Test Script
# This script tests if the backend can start without the database

Write-Host "=== Testing ShebaXpert Backend ===" -ForegroundColor Cyan

# Change to backend directory
Set-Location "f:\Projects\ShebaXpert\backend"

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "[ERROR] Dependencies not installed. Run: npm install" -ForegroundColor Red
    exit 1
}

# Test backend startup
Write-Host "Testing backend server startup..." -ForegroundColor Yellow

# Start the server in a separate process
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -NoNewWindow -PassThru -RedirectStandardOutput "server_output.txt" -RedirectStandardError "server_error.txt"

# Wait a moment for server to start
Start-Sleep -Seconds 5

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Backend server is running successfully!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    } else {
        Write-Host "[ERROR] Server responded with status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Cannot connect to backend server" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Show server output if available
    if (Test-Path "server_output.txt") {
        Write-Host "Server output:" -ForegroundColor Yellow
        Get-Content "server_output.txt" | Write-Host
    }
    
    if (Test-Path "server_error.txt") {
        Write-Host "Server errors:" -ForegroundColor Red
        Get-Content "server_error.txt" | Write-Host
    }
}

# Stop the server
if ($serverProcess -and !$serverProcess.HasExited) {
    $serverProcess.Kill()
    Write-Host "Server process stopped." -ForegroundColor Yellow
}

# Clean up temp files
if (Test-Path "server_output.txt") { Remove-Item "server_output.txt" }
if (Test-Path "server_error.txt") { Remove-Item "server_error.txt" }

Write-Host "=== Test Complete ===" -ForegroundColor Green
