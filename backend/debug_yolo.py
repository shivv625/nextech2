#!/usr/bin/env python3
\"\"\"
YOLO Model Debug Script
Test if YOLO model can be loaded and run basic detection
\"\"\"

import os
import sys
import logging
import numpy as np
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def test_yolo_model():
    \"\"\"Test YOLO model loading and basic functionality\"\"\"
    
    logger.info(\"\ud83d\udd0d Testing YOLO Model Loading...\")
    
    try:
        from ultralytics import YOLO
        logger.info(\"\u2705 ultralytics import successful\")
    except ImportError as e:
        logger.error(f\"\u274c Failed to import ultralytics: {e}\")
        return False
    
    # Test model paths
    model_paths = [
        \"custom_model.pt\",
        \"../yolo/runs/detect/detect3_resume2/weights/best.pt\",
        \"yolo/runs/detect/detect3_resume2/weights/best.pt\",
        \"../yolo/best.pt\",
        \"yolo/best.pt\",
        \"yolov8n.pt\"  # Default fallback
    ]
    
    model = None
    model_path_used = None
    
    for path in model_paths:
        try:
            if os.path.exists(path):
                logger.info(f\"\ud83d\udcdd Found model file: {path}\")
                model = YOLO(path)
                model_path_used = path
                logger.info(f\"\u2705 Successfully loaded model from: {path}\")
                break
            else:
                logger.info(f\"\u26a0\ufe0f Model not found: {path}\")
        except Exception as e:
            logger.error(f\"\u274c Failed to load model from {path}: {e}\")
            continue
    
    if model is None:
        try:
            logger.info(\"\ud83d\udd04 Trying to download default YOLOv8 model...\")
            model = YOLO(\"yolov8n.pt\")
            model_path_used = \"yolov8n.pt (downloaded)\"
            logger.info(\"\u2705 Default model downloaded and loaded\")
        except Exception as e:
            logger.error(f\"\u274c Failed to load default model: {e}\")
            return False
    
    # Test model info
    try:
        logger.info(f\"\ud83d\udcca Model Information:\")
        logger.info(f\"  - Path: {model_path_used}\")
        logger.info(f\"  - Classes: {len(model.names)} classes\")
        logger.info(f\"  - Class names: {list(model.names.values())[:10]}...\")  # Show first 10
        
        # Test detection on a dummy image
        logger.info(\"\ud83d\uddbc\ufe0f Testing detection on dummy image...\")
        dummy_image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        
        results = model(dummy_image, conf=0.5, verbose=False)
        logger.info(f\"\u2705 Detection test successful - {len(results)} result(s)\")
        
        for result in results:
            if result.boxes is not None:
                logger.info(f\"  - Detected {len(result.boxes)} objects\")
            else:
                logger.info(\"  - No objects detected (expected for random image)\")
        
        return True
        
    except Exception as e:
        logger.error(f\"\u274c Model testing failed: {e}\")
        return False

def test_flask_imports():
    \"\"\"Test Flask and related imports\"\"\"
    logger.info(\"\ud83d\udd0d Testing Flask imports...\")
    
    try:
        import flask
        logger.info(f\"\u2705 Flask version: {flask.__version__}\")
        
        from flask_socketio import SocketIO
        logger.info(\"\u2705 Flask-SocketIO import successful\")
        
        import cv2
        logger.info(f\"\u2705 OpenCV version: {cv2.__version__}\")
        
        return True
    except ImportError as e:
        logger.error(f\"\u274c Import failed: {e}\")
        return False

def main():
    \"\"\"Main debug function\"\"\"
    logger.info(\"\ud83d\ude80 YOLO Model Debug Test\")
    logger.info(\"=\" * 50)
    
    # Test Flask imports
    if not test_flask_imports():
        logger.error(\"\u274c Flask imports failed\")
        return False
    
    # Test YOLO model
    if not test_yolo_model():
        logger.error(\"\u274c YOLO model test failed\")
        return False
    
    logger.info(\"=\" * 50)
    logger.info(\"\u2705 ALL TESTS PASSED - YOLO model is working!\")
    logger.info(\"\ud83d\ude80 You can now start the unified server\")
    return True

if __name__ == '__main__':
    success = main()
    if not success:
        sys.exit(1)", "original_text": "", "replace_all": false}]