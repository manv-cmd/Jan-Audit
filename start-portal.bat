@echo off
title JAN Audit Portal
cd /d "%~dp0"

echo ============================================
echo        JAN AUDIT - Social Audit Portal
echo ============================================
echo.

:: Detect Python executable (prefer py launcher, then Python313+, then python)
set "PYTHON_EXE="
where py >nul 2>&1
if not errorlevel 1 (
    py -3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_EXE=py -3"
)

if "%PYTHON_EXE%"=="" (
    if exist "%LocalAppData%\Programs\Python\Python313\python.exe" (
        set "PYTHON_EXE="%LocalAppData%\Programs\Python\Python313\python.exe""
    ) else if exist "%LocalAppData%\Programs\Python\Python312\python.exe" (
        set "PYTHON_EXE="%LocalAppData%\Programs\Python\Python312\python.exe""
    ) else (
        python --version >nul 2>&1
        if not errorlevel 1 set "PYTHON_EXE=python"
    )
)

if "%PYTHON_EXE%"=="" (
    echo ERROR: Python is not installed or not found.
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

:: Ensure .env exists in backend
if not exist "backend\.env" (
    echo Creating backend\.env from template...
    copy "backend\.env.example" "backend\.env" >nul 2>&1
)

:: Install dependencies if needed
echo [1/3] Verifying backend dependencies...
cd backend
%PYTHON_EXE% -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo WARNING: pip check encountered an issue, trying to proceed...
)
echo       Dependencies ready.
echo.

:: Start backend API server
echo [2/3] Starting backend API server at http://127.0.0.1:8000 ...
start "JAN Audit Backend Server (Port 8000)" %PYTHON_EXE% -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

:: Wait 2 seconds for server to bind
timeout /t 2 >nul

:: Start frontend in browser
echo [3/3] Opening Jan Audit Portal in your browser...
cd /d "%~dp0"
start "" "frontend\login.html"
echo.

echo ===================================================
echo  JAN Audit Portal is running!
echo  Backend API:  http://127.0.0.1:8000
echo  API Docs:     http://127.0.0.1:8000/docs
echo.
echo  To shut down the portal, run 'stop-portal.bat'.
echo ===================================================
echo.
pause
