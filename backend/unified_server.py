#!/usr/bin/env python3
"""
Unified Server for RAKSHAK AI Watch
Serves both React frontend and Flask backend with YOLO detection on a single localhost
"""

import os
import sys
import subprocess
import logging
import time
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
project_root = backend_dir.parent
sys.path.insert(0, str(backend_dir))

# Import the YOLO detection app
from yolo_detection import app, socketio, detector

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def build_frontend():
    """Build the React frontend for production"""
    logger.info("Building React frontend...")
    try:
        # Change to project root
        os.chdir(project_root)
        
        # Run npm build
        result = subprocess.run(
            ['npm', 'run', 'build'], 
            capture_output=True, 
            text=True, 
            check=True
        )
        
        logger.info("✅ Frontend built successfully")
        logger.info(f"Build output: {result.stdout}")
        
        # Check if dist directory exists
        dist_dir = project_root / 'dist'
        if dist_dir.exists():
            logger.info(f"✅ Frontend build files available at: {dist_dir}")
            return True
        else:
            logger.error("❌ Frontend build failed - dist directory not found")
            return False
            
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Frontend build failed: {e}")
        logger.error(f"Error output: {e.stderr}")
        return False
    except FileNotFoundError:
        logger.error("❌ npm command not found. Please install Node.js and npm")
        return False

def install_dependencies():
    """Install both Python and Node.js dependencies"""
    logger.info("Installing dependencies...")
    
    # Install Python dependencies
    try:
        logger.info("Installing Python dependencies...")
        subprocess.run(
            [sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
            cwd=backend_dir,
            check=True
        )
        logger.info("✅ Python dependencies installed")
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Failed to install Python dependencies: {e}")
        return False
    
    # Install Node.js dependencies
    try:
        logger.info("Installing Node.js dependencies...")
        subprocess.run(
            ['npm', 'install'],
            cwd=project_root,
            check=True
        )
        logger.info("✅ Node.js dependencies installed")
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Failed to install Node.js dependencies: {e}")
        return False
    except FileNotFoundError:
        logger.error("❌ npm command not found. Please install Node.js and npm")
        return False
    
    return True

def check_model():
    """Check if YOLO model is available"""
    if detector.model is None:
        logger.warning("⚠️ YOLO model not loaded - detection features may not work")
        return False
    else:
        logger.info("✅ YOLO model loaded successfully")
        return True

def main():
    """Main function to start the unified server"""
    logger.info("="*60)
    logger.info("🚀 RAKSHAK AI Watch - Unified Server Startup")
    logger.info("="*60)
    
    # Check if we're in the right directory
    if not (backend_dir / 'yolo_detection.py').exists():
        logger.error("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Install dependencies
    logger.info("[1/4] Installing dependencies...")
    if not install_dependencies():
        logger.error("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Build frontend
    logger.info("[2/4] Building React frontend...")
    if not build_frontend():
        logger.error("❌ Failed to build frontend")
        sys.exit(1)
    
    # Check YOLO model
    logger.info("[3/4] Checking YOLO model...")
    check_model()
    
    # Start unified server
    logger.info("[4/4] Starting unified server...")
    logger.info("")
    logger.info("🌟 " + "="*50)
    logger.info("🌟   RAKSHAK AI Watch - Ready!")
    logger.info("🌟 " + "="*50)
    logger.info("")
    logger.info("📡 Server URL: http://localhost:5000")
    logger.info("🎥 YOLO Detection: " + ("✅ ENABLED" if detector.model else "❌ DISABLED"))
    logger.info("🔗 Socket.IO: ✅ ENABLED")
    logger.info("📱 Frontend: ✅ SERVED FROM BACKEND")
    logger.info("")
    logger.info("🎯 Features Available:")
    logger.info("   • 4-Camera Live Surveillance")
    logger.info("   • Real-time YOLO Object Detection")
    logger.info("   • Person, Vehicle, Drone, Weapon Detection")
    logger.info("   • Real-time Socket.IO Updates")
    logger.info("   • Automatic Threat Alerts")
    logger.info("   • Army Personnel Dashboard")
    logger.info("")
    logger.info("🚀 Access your application at: http://localhost:5000")
    logger.info("")
    logger.info("Press Ctrl+C to stop the server")
    logger.info("="*60)
    
    try:
        # Start the unified server with Socket.IO
        socketio.run(app, host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        logger.info("\n🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()