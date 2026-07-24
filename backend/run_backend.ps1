Write-Host "Starting LuminaHealth FastAPI Backend..." -ForegroundColor Green
Set-Location -Path $PSScriptRoot
& "$PSScriptRoot\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
