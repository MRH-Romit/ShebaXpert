# Test admin functionality
$API_BASE = "http://localhost:5000/api"

Write-Host "Testing admin login..." -ForegroundColor Green

# Admin login
$loginBody = @{
    email = "admin@shebaxpert.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Yellow
    
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # Test dashboard stats
    Write-Host "`nTesting dashboard stats..." -ForegroundColor Green
    $statsResponse = Invoke-RestMethod -Uri "$API_BASE/admin/dashboard/stats" -Method GET -Headers $headers
    Write-Host "Dashboard stats retrieved successfully!" -ForegroundColor Green
    $statsResponse | ConvertTo-Json -Depth 3
    
    # Test get users
    Write-Host "`nTesting get users..." -ForegroundColor Green
    $usersResponse = Invoke-RestMethod -Uri "$API_BASE/admin/users" -Method GET -Headers $headers
    Write-Host "Users data retrieved successfully!" -ForegroundColor Green
    Write-Host "Number of users: $($usersResponse.users.Count)" -ForegroundColor Yellow
    
    # Test database info
    Write-Host "`nTesting database info..." -ForegroundColor Green
    $dbResponse = Invoke-RestMethod -Uri "$API_BASE/admin/database/info" -Method GET -Headers $headers
    Write-Host "Database info retrieved successfully!" -ForegroundColor Green
    $dbResponse | ConvertTo-Json -Depth 2
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
