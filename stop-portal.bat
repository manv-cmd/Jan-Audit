@echo off
title Stop JAN Audit Portal
echo ============================================
echo   Stopping JAN Audit Portal...
echo ============================================
echo.

:: Kill process listening on port 8000
set FOUND=0
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Stopping backend process (PID %%p) on port 8000...
    taskkill /F /PID %%p >nul 2>&1
    set FOUND=1
)

:: Close any backend console windows titled for JAN Audit
taskkill /F /FI "WINDOWTITLE eq JAN Audit Backend Server*" >nul 2>&1

echo.
echo Jan Audit Portal has been stopped.
echo.
timeout /t 2 >nul
