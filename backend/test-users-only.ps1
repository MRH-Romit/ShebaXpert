$login = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body (@{email='admin@shebaxpert.com'; password='admin123'} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Login successful" -ForegroundColor Green

$headers = @{
    'Authorization' = "Bearer $($login.token)"
}

$users = Invoke-RestMethod -Uri 'http://localhost:5000/api/admin/users' -Headers $headers
Write-Host "Users endpoint called successfully" -ForegroundColor Green
$users | ConvertTo-Json -Depth 5
