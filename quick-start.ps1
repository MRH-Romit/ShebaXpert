# ShebaXpert Quick Start Script
# This script starts the application with proper error handling and setup

Write-Host "=== ShebaXpert Quick Start ===" -ForegroundColor Cyan
Write-Host "Starting ShebaXpert Application..." -ForegroundColor Green

# Function to stop processes on specific ports
function Stop-ProcessOnPort {
    param($port)
    try {
        $processes = netstat -ano | findstr ":$port "
        foreach ($line in $processes) {
            $parts = $line -split '\s+'
            if ($parts.Count -gt 4) {
                $processId = $parts[4]
                if ($processId -match '^\d+$') {
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "Stopped process $processId on port $port" -ForegroundColor Yellow
                }
            }
        }
    } catch {
        # Ignore errors
    }
}

# Clean up any existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Stop-ProcessOnPort 5000
Stop-ProcessOnPort 8080

# Check if backend dependencies are installed
if (!(Test-Path "f:\Projects\ShebaXpert\backend\node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location "f:\Projects\ShebaXpert\backend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Start backend server
Write-Host "Starting backend server on port 5000..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "f:\Projects\ShebaXpert\backend"
    node server.js
}

# Wait for backend to start
Start-Sleep -Seconds 3

# Check if backend is running
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 10
    Write-Host "[OK] Backend server is running successfully!" -ForegroundColor Green
    Write-Host "Backend status: $($healthCheck.status)" -ForegroundColor Cyan
} catch {
    Write-Host "[ERROR] Backend server failed to start" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Show job output
    $jobOutput = Receive-Job -Job $backendJob
    if ($jobOutput) {
        Write-Host "Backend output:" -ForegroundColor Yellow
        $jobOutput | Write-Host
    }
    
    Stop-Job -Job $backendJob
    Remove-Job -Job $backendJob
    exit 1
}

# Try to start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Cyan

# Check for Python installations
$pythonCommand = $null
$pythonCommands = @("python", "python3", "py")

foreach ($cmd in $pythonCommands) {
    try {
        $version = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pythonCommand = $cmd
            Write-Host "[OK] Found Python: $version" -ForegroundColor Green
            break
        }
    } catch {
        # Continue to next command
    }
}

if ($pythonCommand) {
    # Start Python HTTP server
    $frontendJob = Start-Job -ScriptBlock {
        param($pythonCmd)
        Set-Location "f:\Projects\ShebaXpert"
        & $pythonCmd -m http.server 8080
    } -ArgumentList $pythonCommand
    
    Start-Sleep -Seconds 2
    
    # Check if frontend is running
    try {
        Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5 | Out-Null
        Write-Host "[OK] Frontend server is running on port 8080!" -ForegroundColor Green
    } catch {
        Write-Host "[WARNING] Frontend server may not be running properly" -ForegroundColor Yellow
    }
    
    # Open the application
    Write-Host "Opening ShebaXpert application..." -ForegroundColor Green
    Start-Process "http://localhost:8080/Landing%20Page/LandingPage.html"
    
} else {
    Write-Host "[ERROR] Python not found. Please install Python to run the frontend." -ForegroundColor Red
    Write-Host "You can install Python from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Or from Microsoft Store: ms-windows-store://pdp/?ProductId=9NJ46SX7X90P" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    Write-Host "Backend is still running on: http://localhost:5000" -ForegroundColor Cyan
}

Write-Host "" -ForegroundColor White
Write-Host "=== ShebaXpert Application Status ===" -ForegroundColor Green
Write-Host "Backend API: http://localhost:5000 [OK]" -ForegroundColor Cyan
if ($pythonCommand) {
    Write-Host "Frontend: http://localhost:8080 [OK]" -ForegroundColor Cyan
    Write-Host "Landing Page: http://localhost:8080/Landing%20Page/LandingPage.html [OK]" -ForegroundColor Cyan
} else {
    Write-Host "Frontend: Not started (Python not found) [ERROR]" -ForegroundColor Red
}
Write-Host "" -ForegroundColor White

if ($pythonCommand) {
    Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Yellow
    
    # Keep the script running
    try {
        while ($true) {
            Start-Sleep -Seconds 30
            
            # Check if jobs are still running
            $backendRunning = (Get-Job -Id $backendJob.Id).State -eq "Running"
            $frontendRunning = (Get-Job -Id $frontendJob.Id).State -eq "Running"
            
            if ($backendRunning -and $frontendRunning) {
                Write-Host "Services running... $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor DarkGreen
            } else {
                Write-Host "Some services stopped. Exiting..." -ForegroundColor Red
                break
            }
        }
    } catch {
        Write-Host "Shutting down services..." -ForegroundColor Yellow
    } finally {
        # Clean up jobs
        Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
        Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "Backend will continue running. To stop it, close this window or press Ctrl+C" -ForegroundColor Yellow
    
    # Keep backend running
    try {
        while ($true) {
            Start-Sleep -Seconds 30
            if ((Get-Job -Id $backendJob.Id).State -ne "Running") {
                Write-Host "Backend service stopped. Exiting..." -ForegroundColor Red
                break
            }
            Write-Host "Backend service running... $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor DarkGreen
        }
    } catch {
        Write-Host "Shutting down backend..." -ForegroundColor Yellow
    } finally {
        Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    }
}
