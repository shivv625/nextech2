@echo off
echo =============================================
echo   RAKSHAK AI WATCH - Frontend Development Server
echo =============================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%

echo Project Root: %PROJECT_ROOT%
echo.

REM Install/Update Node.js dependencies if needed
echo [1/2] Checking Node.js dependencies...
cd /d "%PROJECT_ROOT%"
if not exist node_modules (
    echo Installing Node.js dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to install Node.js dependencies
        pause
        exit /b 1
    )
)
echo ✓ Node.js dependencies ready
echo.

echo [2/2] Starting React Development Server...
echo.
echo =============================================
echo   Frontend development server starting...
echo   - The application will be available at:
echo     * http://localhost:8087
echo   - Make sure the backend is running at:
echo     * http://localhost:5000
echo   - Press Ctrl+C to stop the server
echo =============================================
echo.

npm run dev

pause