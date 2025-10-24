@echo off
echo ========================================
echo   MovieSearch 2025 - Quick Start
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo [1/5] Checking Node.js version...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/5] Checking npm version...
npm --version

echo.
echo [3/5] Checking if dependencies are installed...
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed ✓
)

echo.
echo [4/5] Checking environment configuration...
if not exist ".env.local" (
    echo.
    echo ⚠️  WARNING: .env.local file not found!
    echo.
    echo You need to create .env.local with your API keys:
    echo   1. Clerk keys from https://dashboard.clerk.com
    echo   2. TMDB API key from https://www.themoviedb.org/settings/api
    echo   3. MongoDB URI from https://cloud.mongodb.com
    echo.
    echo See 📖_ENV_SETUP_GUIDE.md for detailed instructions.
    echo.
    pause
)

echo.
echo [5/5] Starting development server...
echo.
echo ========================================
echo   Server will start at:
echo   http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause

