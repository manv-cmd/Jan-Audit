@echo off
echo Installing JAN Audit backend dependencies...
cd /d "%~dp0"
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: pip install failed. Make sure Python 3.11+ is installed.
    pause
    exit /b 1
)
echo.
echo Starting JAN Audit API server...
echo Backend will run at http://127.0.0.1:8000
echo API docs available at http://127.0.0.1:8000/docs
echo Press Ctrl+C to stop.
echo.
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
