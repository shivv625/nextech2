#!/usr/bin/env python3
"""
Test script for YOLO model integration
"""

import sys
import os
import cv2
import numpy as np
from ultralytics import YOLO

def test_yolo_model():
    """Test if YOLO model loads and works correctly"""
    print("Testing YOLO model integration...")
    
    # Check if model file exists
    model_path = "../yolo/yolov8n.pt"
    if not os.path.exists(model_path):
        print(f"❌ Error: Model file not found at {model_path}")
        return False
    
    print(f"✅ Model file found at {model_path}")
    
    try:
        # Load model
        print("Loading YOLO model...")
        model = YOLO(model_path)
        print("✅ Model loaded successfully")
        
        # Test with a simple image
        print("Creating test image...")
        test_image = np.zeros((480, 640, 3), dtype=np.uint8)
        test_image[100:200, 100:200] = [0, 255, 0]  # Green rectangle
        
        # Run detection
        print("Running detection...")
        results = model(test_image, conf=0.5, verbose=False)
        
        print(f"✅ Detection completed. Found {len(results)} results")
        
        # Print model info
        print(f"Model names: {model.names}")
        print(f"Number of classes: {len(model.names)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing model: {e}")
        return False

def test_dependencies():
    """Test if all required dependencies are available"""
    print("Testing dependencies...")
    
    required_modules = [
        'ultralytics',
        'cv2',
        'flask',
        'numpy',
        'PIL'
    ]
    
    missing_modules = []
    
    for module in required_modules:
        try:
            if module == 'cv2':
                import cv2
            elif module == 'PIL':
                from PIL import Image
            else:
                __import__(module)
            print(f"✅ {module}")
        except ImportError:
            print(f"❌ {module}")
            missing_modules.append(module)
    
    if missing_modules:
        print(f"Missing modules: {missing_modules}")
        print("Install with: pip install -r requirements.txt")
        return False
    
    return True

def main():
    """Main test function"""
    print("=== YOLO Integration Test ===")
    print()
    
    # Test dependencies
    if not test_dependencies():
        print("❌ Dependency test failed")
        sys.exit(1)
    
    print()
    
    # Test YOLO model
    if not test_yolo_model():
        print("❌ YOLO model test failed")
        sys.exit(1)
    
    print()
    print("✅ All tests passed! YOLO integration is ready.")
    print()
    print("Next steps:")
    print("1. Start the backend: python yolo_detection.py")
    print("2. Start the frontend: npm run dev")
    print("3. Open http://localhost:8087")

if __name__ == "__main__":
    main()

