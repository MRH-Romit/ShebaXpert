# ShebaXpert Database Setup Script
# This script helps set up the database for the ShebaXpert application

Write-Host "=== ShebaXpert Database Setup ===" -ForegroundColor Cyan

# Check if MySQL is installed
try {
    $mysqlVersion = mysql --version
    Write-Host "[OK] MySQL found: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] MySQL not found" -ForegroundColor Red
    Write-Host "Please install MySQL Server from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    Write-Host "Or install via winget: winget install Oracle.MySQL" -ForegroundColor Yellow
    Write-Host "After installation, add MySQL to your PATH environment variable" -ForegroundColor Yellow
    
    # Ask if user wants to continue anyway
    $continue = Read-Host "Do you want to continue without MySQL? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Check if database exists and create if needed
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    Write-Host "Creating database and tables..." -ForegroundColor Yellow
    
    # Read database credentials from .env file
    $envFile = "f:\Projects\ShebaXpert\backend\.env"
    if (Test-Path $envFile) {
        $env = Get-Content $envFile | ConvertFrom-StringData
        $dbHost = $env.DB_HOST
        $dbUser = $env.DB_USER
        $dbPassword = $env.DB_PASSWORD
        $dbName = $env.DB_NAME
        
        Write-Host "Database config: $dbUser@$dbHost/$dbName" -ForegroundColor Cyan
        
        # Execute schema.sql
        try {
            $schemaPath = "f:\Projects\ShebaXpert\backend\schema.sql"
            if (Test-Path $schemaPath) {
                mysql -h $dbHost -u $dbUser -p$dbPassword -e "source $schemaPath"
                Write-Host "[OK] Database schema created successfully" -ForegroundColor Green
            } else {
                Write-Host "[ERROR] Schema file not found: $schemaPath" -ForegroundColor Red
            }
        } catch {
            Write-Host "[ERROR] Failed to create database schema" -ForegroundColor Red
            Write-Host "You may need to create the database manually using:" -ForegroundColor Yellow
            Write-Host "mysql -u $dbUser -p$dbPassword < f:\Projects\ShebaXpert\backend\schema.sql" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ERROR] .env file not found" -ForegroundColor Red
    }
} else {
    Write-Host "[INFO] Skipping database setup - MySQL not available" -ForegroundColor Yellow
}

Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MySQL is running" -ForegroundColor Yellow
Write-Host "2. Run: .\start-all.ps1" -ForegroundColor Yellow
