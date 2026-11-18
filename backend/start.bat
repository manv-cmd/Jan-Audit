@echo off
title JAN Audit Backend
cd /d "%~dp0"

:: Detect Python executable
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
        set "PYTHON_EXE=python"
    )
)

if not exist ".env" (
    if exist ".env.example" copy ".env.example" ".env" >nul 2>&1
)

echo Installing JAN Audit backend dependencies...
%PYTHON_EXE% -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo WARNING: pip encountered an issue, attempting to start server anyway...
)

echo.
echo Starting JAN Audit API server...
echo Backend will run at http://127.0.0.1:8000
echo API docs available at http://127.0.0.1:8000/docs
echo Press Ctrl+C to stop.
echo.

%PYTHON_EXE% -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
