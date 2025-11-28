# Start both development servers for Windows
Write-Host "Starting RapidPhotoFlow development servers..." -ForegroundColor Green

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'Backend starting...' -ForegroundColor Cyan; npm run dev"

# Wait a moment
Start-Sleep -Seconds 1

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'Frontend starting...' -ForegroundColor Cyan; npm run dev"

Write-Host "`nBoth servers are starting in separate windows." -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173 (or check the window for the actual port)" -ForegroundColor Yellow

