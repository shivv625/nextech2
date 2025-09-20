@echo off
echo =============================================
echo   RAKSHAK AI WATCH - Complete System Startup
echo =============================================
echo.

set PROJECT_ROOT=%~dp0

echo Starting Backend Server...
start "RAKSHAK Backend" cmd /k "cd /d "%PROJECT_ROOT%backend" && call ..\venv\Scripts\activate.bat && python yolo_detection.py"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "RAKSHAK Frontend" cmd /k "cd /d "%PROJECT_ROOT%" && npm run dev"

echo Waiting 10 seconds for frontend to start...
timeout /t 10 /nobreak > nul

echo Opening application in browser...
start http://localhost:8087

echo.
echo =============================================
echo   System Status:
echo   - Backend: http://localhost:5000
echo   - Frontend: http://localhost:8087
echo   - YOLO Detection: ENABLED on all 4 cameras
echo =============================================
echo.
echo Press any key to close this window...
pause > nul