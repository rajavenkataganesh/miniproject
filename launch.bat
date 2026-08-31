@echo off
SETLOCAL EnableDelayedExpansion
title EndpointGuard - Launch Script

echo ========================================================
echo        EndpointGuard - Web Endpoint Security Analyzer
echo ========================================================
echo.

:: 1. Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.9+ and try again.
    pause
    exit /b 1
)

:: 2. Check Node.js & npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH.
    echo Please install Node.js and try again.
    pause
    exit /b 1
)

:: 3. Setup Python Virtual Environment if missing
if not exist "venv" (
    echo [1/3] Creating Python Virtual Environment (venv)...
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate

:: 4. Install backend requirements if not already installed
if not exist "venv\.installed" (
    echo [2/3] Installing Python backend requirements...
    pip install -r requirements.txt
    if %errorlevel% equ 0 (
        echo installed > venv\.installed
    ) else (
        echo [ERROR] Failed to install Python packages.
        pause
        exit /b 1
    )
)

:: 5. Install frontend packages if node_modules missing
if not exist "frontend\node_modules" (
    echo [3/3] Installing Frontend npm packages...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ========================================================
echo Starting EndpointGuard Services...
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo ========================================================
echo.

:: Launch Backend in a background window
start "EndpointGuard Backend" cmd /k "call venv\Scripts\activate && cd backend && uvicorn main:app --port 8000 --reload"

:: Launch Frontend in a background window
start "EndpointGuard Frontend" cmd /k "cd frontend && npm run dev"

:: Wait 3 seconds and open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo EndpointGuard has launched successfully!
echo Close the command windows when you wish to stop the servers.
pause
