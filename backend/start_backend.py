#!/usr/bin/env python3
"""
Startup script for YOLO Detection Backend
"""

import os
import sys
import subprocess
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import ultralytics
        import cv2
        import flask
        import numpy
        logger.info("All dependencies are installed")
        return True
    except ImportError as e:
        logger.error(f"Missing dependency: {e}")
        return False

def install_dependencies():
    """Install required dependencies"""
    logger.info("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        logger.info("Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to install dependencies: {e}")
        return False

def check_yolo_model():
    """Check if YOLO model file exists"""
    # Look for custom trained model first
    custom_model_paths = [
        "../yolo/runs/detect/detect3_resume2/weights/best.pt",
        "yolo/runs/detect/detect3_resume2/weights/best.pt",
        "../yolo/best.pt",
        "yolo/best.pt"
    ]
    
    for model_path in custom_model_paths:
        if os.path.exists(model_path):
            logger.info(f"Custom trained YOLO model found at {model_path}")
            return True
    
    # Check for default model
    default_model_path = "yolov8n.pt"
    if os.path.exists(default_model_path):
        logger.info(f"Default YOLO model found at {default_model_path}")
        return True
    else:
        logger.warning(f"No YOLO model found. Will attempt to download default model.")
        return True  # YOLOv8 will download automatically if not found

def start_server():
    """Start the Flask server"""
    logger.info("Starting YOLO Detection Backend Server...")
    try:
        from yolo_detection import app
        app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        return False

def main():
    """Main startup function"""
    logger.info("=== YOLO Detection Backend Startup ===")
    
    # Check if we're in the right directory
    if not os.path.exists("yolo_detection.py"):
        logger.error("Please run this script from the backend directory")
        sys.exit(1)
    
    # Check YOLO model
    if not check_yolo_model():
        logger.warning("Custom YOLO model not found, but will proceed with default model")
    
    # Check dependencies
    if not check_dependencies():
        logger.info("Installing missing dependencies...")
        if not install_dependencies():
            logger.error("Failed to install dependencies")
            sys.exit(1)
    
    # Start server
    logger.info("Starting server...")
    start_server()

if __name__ == "__main__":
    main()

