@echo off
echo Starting NiveshAI - Indian Share Market AI Chatbot
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 16+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Install dependencies if not already installed
if not exist "node_modules" (
    echo Installing server dependencies...
    npm install
    echo.
)

REM Install client dependencies if not already installed
if not exist "client\node_modules" (
    echo Installing client dependencies...
    npm run install:client
    echo.
)

REM Build client for production
echo Building client...
npm run build
echo.

REM Start the server
echo Starting NiveshAI server...
echo The application will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm start
