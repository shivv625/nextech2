@echo off
echo =============================================
echo   RAKSHAK AI Watch - Unified Single Localhost
echo =============================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%

echo \ud83d\ude80 Starting RAKSHAK AI Watch Unified Server...
echo Project Root: %PROJECT_ROOT%
echo.

REM Activate virtual environment
echo [Step 1/2] Activating Python virtual environment...
call \"%PROJECT_ROOT%venv\\Scripts\\activate.bat\"
if %ERRORLEVEL% neq 0 (
    echo \u274c ERROR: Failed to activate virtual environment
    echo Please ensure the virtual environment exists at: %PROJECT_ROOT%venv
    pause
    exit /b 1
)
echo \u2705 Virtual environment activated
echo.

echo [Step 2/2] Starting unified server...
cd /d \"%PROJECT_ROOT%backend\"
echo.
echo \ud83c\udf86 ============================================
echo \ud83c\udf86   RAKSHAK AI Watch - Unified Server
echo \ud83c\udf86 ============================================
echo \ud83c\udf86   \u2022 Frontend + Backend on single localhost
echo \ud83c\udf86   \u2022 Socket.IO real-time communication
echo \ud83c\udf86   \u2022 YOLO object detection integration
echo \ud83c\udf86   \u2022 4-camera surveillance system
echo \ud83c\udf86 ============================================
echo.
echo \ud83d\udce1 Starting server... Please wait...
echo.

python unified_server.py

echo.
echo \ud83d\ude91 Server stopped. Press any key to exit...
pause > nul", "original_text": "", "replace_all": false}]