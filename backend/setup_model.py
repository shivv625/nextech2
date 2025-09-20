#!/usr/bin/env python3
"""
Setup script to copy custom YOLO model to backend directory
"""

import os
import shutil
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_custom_model():
    """Copy custom YOLO model to backend directory"""
    
    # Possible locations of the custom model
    custom_model_paths = [
        "../yolo/runs/detect/detect3_resume2/weights/best.pt",
        "yolo/runs/detect/detect3_resume2/weights/best.pt",
        "../yolo/best.pt",
        "yolo/best.pt"
    ]
    
    # Target location in backend
    target_path = "custom_model.pt"
    
    # Find and copy custom model
    for source_path in custom_model_paths:
        if os.path.exists(source_path):
            try:
                shutil.copy2(source_path, target_path)
                logger.info(f"Custom YOLO model copied from {source_path} to {target_path}")
                return True
            except Exception as e:
                logger.error(f"Failed to copy model from {source_path}: {e}")
                continue
    
    logger.warning("Custom YOLO model not found in any expected location")
    logger.info("Available locations checked:")
    for path in custom_model_paths:
        logger.info(f"  - {path}")
    
    return False

if __name__ == "__main__":
    logger.info("=== YOLO Model Setup ===")
    setup_custom_model()