@echo off
echo =============================================
echo   RAKSHAK AI WATCH - YOLO Integration Setup
echo =============================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%

echo Project Root: %PROJECT_ROOT%
echo.

REM Activate virtual environment
echo [1/5] Activating Python virtual environment...
call "%PROJECT_ROOT%venv\Scripts\activate.bat"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to activate virtual environment
    echo Please ensure the virtual environment exists at: %PROJECT_ROOT%venv
    pause
    exit /b 1
)
echo ✓ Virtual environment activated
echo.

REM Check if custom YOLO model exists
echo [2/5] Checking for custom YOLO model...
set CUSTOM_MODEL_PATH=%PROJECT_ROOT%yolo\runs\detect\detect3_resume2\weights\best.pt
if exist "%CUSTOM_MODEL_PATH%" (
    echo ✓ Custom YOLO model found at: %CUSTOM_MODEL_PATH%
    
    REM Copy model to backend for easier access
    echo   Copying model to backend directory...
    copy "%CUSTOM_MODEL_PATH%" "%PROJECT_ROOT%backend\custom_model.pt"
    if %ERRORLEVEL% equ 0 (
        echo ✓ Model copied successfully
    ) else (
        echo ! Warning: Could not copy model file
    )
) else (
    echo ! Warning: Custom YOLO model not found
    echo   Looking for: %CUSTOM_MODEL_PATH%
    echo   Will use default YOLOv8 model instead
)
echo.

REM Install/Update Python dependencies
echo [3/5] Installing Python dependencies...
cd /d "%PROJECT_ROOT%backend"
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed
echo.

REM Install/Update Node.js dependencies
echo [4/5] Installing Node.js dependencies...
cd /d "%PROJECT_ROOT%"
npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed
echo.

echo [5/5] Starting YOLO Detection Backend...
cd /d "%PROJECT_ROOT%backend"

REM Start the backend server
echo Starting Flask server on http://localhost:5000
echo.
echo =============================================
echo   Backend server starting...
echo   - API endpoints will be available at:
echo     * http://localhost:5000/health
echo     * http://localhost:5000/detect
echo     * http://localhost:5000/detect_with_visualization
echo   - Press Ctrl+C to stop the server
echo =============================================
echo.

python yolo_detection.py

pause