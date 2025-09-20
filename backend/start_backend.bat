@echo off
echo Starting YOLO Detection Backend...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "yolo_detection.py" (
    echo Error: Please run this script from the backend directory
    pause
    exit /b 1
)

REM Check if YOLO model exists
if not exist "..\yolo\yolov8n.pt" (
    echo Error: YOLO model not found
    echo Please ensure yolov8n.pt is in the yolo/ directory
    pause
    exit /b 1
)

echo Installing dependencies...
python -m pip install -r requirements.txt

echo.
echo Starting YOLO Detection Backend Server...
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python yolo_detection.py

pause

