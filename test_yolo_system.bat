@echo off
echo =============================================
echo   YOLO Detection Troubleshooting Test
echo =============================================
echo.

set PROJECT_ROOT=%~dp0
echo Testing YOLO Detection System...
echo Project Root: %PROJECT_ROOT%
echo.

REM Test 1: Check if backend files exist
echo [Test 1] Checking backend files...
if exist \"%PROJECT_ROOT%backend\\yolo_detection.py\" (
    echo   ✅ yolo_detection.py found
) else (
    echo   ❌ yolo_detection.py NOT found
    goto :error
)

if exist \"%PROJECT_ROOT%backend\\unified_server.py\" (
    echo   ✅ unified_server.py found
) else (
    echo   ❌ unified_server.py NOT found
    goto :error
)

REM Test 2: Check if virtual environment exists
echo.
echo [Test 2] Checking virtual environment...
if exist \"%PROJECT_ROOT%venv\\Scripts\\activate.bat\" (
    echo   ✅ Virtual environment found
) else (
    echo   ❌ Virtual environment NOT found
    echo   Please create virtual environment first
    goto :error
)

REM Test 3: Check if YOLO model exists
echo.
echo [Test 3] Checking YOLO model files...
set MODEL_FOUND=0

if exist \"%PROJECT_ROOT%yolo\\runs\\detect\\detect3_resume2\\weights\\best.pt\" (
    echo   ✅ Custom YOLO model found at: yolo\\runs\\detect\\detect3_resume2\\weights\\best.pt
    set MODEL_FOUND=1
)

if exist \"%PROJECT_ROOT%backend\\custom_model.pt\" (
    echo   ✅ Backend YOLO model found at: backend\\custom_model.pt
    set MODEL_FOUND=1
)

if %MODEL_FOUND%==0 (
    echo   ⚠️  Custom YOLO model not found - will use default YOLOv8
    echo   This is OK, but custom detection may not work as expected
)

REM Test 4: Test Python environment
echo.
echo [Test 4] Testing Python environment...
call \"%PROJECT_ROOT%venv\\Scripts\\activate.bat\"
if %ERRORLEVEL% neq 0 (
    echo   ❌ Failed to activate virtual environment
    goto :error
)

echo   ✅ Virtual environment activated
echo   Testing Python imports...

python -c \"import sys; print('  Python version:', sys.version.split()[0])\" 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ❌ Python not working
    goto :error
)

echo   Testing required packages...
python -c \"import flask; print('  Flask version:', flask.__version__)\" 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ❌ Flask not installed
    echo   Run: pip install -r backend\\requirements.txt
    goto :error
)

python -c \"import ultralytics; print('  Ultralytics installed')\" 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ❌ Ultralytics not installed
    echo   Run: pip install ultralytics==8.0.196
    goto :error
)

python -c \"import cv2; print('  OpenCV version:', cv2.__version__)\" 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ❌ OpenCV not installed
    echo   Run: pip install opencv-python==4.8.1.78
    goto :error
)

echo   ✅ All Python packages installed

REM Test 5: Test YOLO model loading
echo.
echo [Test 5] Testing YOLO model loading...
python -c \"from ultralytics import YOLO; model = YOLO('yolov8n.pt'); print('  ✅ YOLO model loads successfully'); print('  Model classes:', len(model.names))\" 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ❌ YOLO model loading failed
    echo   This might be a network issue downloading the model
    goto :error
)

REM Test 6: Check Node.js and frontend
echo.
echo [Test 6] Checking frontend...
if exist \"%PROJECT_ROOT%package.json\" (
    echo   ✅ package.json found
) else (
    echo   ❌ package.json NOT found
    goto :error
)

if exist \"%PROJECT_ROOT%dist\\index.html\" (
    echo   ✅ Frontend build found (dist/index.html)
) else (
    echo   ⚠️  Frontend not built - will build automatically
)

REM Success!
echo.
echo =============================================
echo   ✅ ALL TESTS PASSED!
echo =============================================
echo.
echo Your YOLO detection system is ready!
echo.
echo Next steps:
echo   1. Run: start_unified.bat
echo   2. Open: http://localhost:5000
echo   3. Check camera feeds for YOLO detection
echo.
echo If YOLO detection still doesn't work:
echo   - Check browser console (F12)
echo   - Read: YOLO_TROUBLESHOOTING.md
echo.
pause
exit /b 0

:error
echo.
echo =============================================
echo   ❌ TESTS FAILED!
echo =============================================
echo.
echo Please fix the errors above and try again.
echo.
echo Common fixes:
echo   1. Install missing packages: pip install -r backend\\requirements.txt
echo   2. Create virtual environment: python -m venv venv
echo   3. Build frontend: npm install ^&^& npm run build
echo.
echo For detailed help, read: YOLO_TROUBLESHOOTING.md
echo.
pause
exit /b 1", "original_text": "", "replace_all": false}]