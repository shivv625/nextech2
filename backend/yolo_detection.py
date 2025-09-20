#!/usr/bin/env python3
"""
YOLO Object Detection Backend API
Handles real-time object detection using the trained YOLOv8 model
"""

import cv2
import numpy as np
import base64
import json
from ultralytics import YOLO
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
from typing import Dict, List, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class YOLODetector:
    def __init__(self, model_path: str = "../yolo/runs/detect/detect3_resume2/weights/best.pt"):
        """Initialize YOLO detector with the trained model"""
        self.model_path = model_path
        self.model = None
        self.load_model()
        
        # Detection classes we're interested in - updated for custom trained model
        self.target_classes = {
            'person': 0,
            'car': 2, 'truck': 7, 'bus': 5, 'motorcycle': 3, 'bicycle': 1,
            'airplane': 4, 'aeroplane': 4,  # Will be mapped to 'drone'
            'knife': 43, 'scissors': 76, 'gun': 28, 'pistol': 28,
            'weapon': 28, 'rifle': 28, 'firearm': 28
        }
        
        # Class mapping for our application
        self.class_mapping = {
            'person': 'person',
            'car': 'vehicle', 'truck': 'vehicle', 'bus': 'vehicle', 
            'motorcycle': 'vehicle', 'bicycle': 'vehicle',
            'airplane': 'drone', 'aeroplane': 'drone',  # Map airplane to drone
            'knife': 'weapon', 'scissors': 'weapon', 'gun': 'weapon', 
            'pistol': 'weapon', 'weapon': 'weapon', 'rifle': 'weapon', 'firearm': 'weapon'
        }
    
    def load_model(self):
        """Load the YOLO model"""
        try:
            # Try to load custom trained model first
            if os.path.exists(self.model_path):
                self.model = YOLO(self.model_path)
                logger.info(f"Custom trained YOLO model loaded successfully from {self.model_path}")
            else:
                # Fallback to default model
                logger.warning(f"Custom model not found at {self.model_path}, using default yolov8n.pt")
                self.model = YOLO("yolov8n.pt")
                logger.info("Default YOLO model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            # Try one more fallback
            try:
                logger.info("Attempting to load default yolov8n.pt model...")
                self.model = YOLO("yolov8n.pt")
                logger.info("Default YOLO model loaded as fallback")
            except Exception as fallback_error:
                logger.error(f"Fallback model loading also failed: {fallback_error}")
                raise fallback_error
    
    def preprocess_image(self, image_data: str) -> np.ndarray:
        """Convert base64 image data to OpenCV format"""
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                raise ValueError("Failed to decode image")
                
            return image
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise e
    
    def detect_objects(self, image: np.ndarray, confidence_threshold: float = 0.5) -> List[Dict]:
        """Perform object detection on the image"""
        try:
            # Run YOLO inference
            results = self.model(image, conf=confidence_threshold, verbose=False)
            
            detections = []
            
            for result in results:
                if result.boxes is not None:
                    for box in result.boxes:
                        # Get class ID and confidence
                        cls_id = int(box.cls[0])
                        confidence = float(box.conf[0])
                        
                        # Get class name
                        class_name = self.model.names[cls_id]
                        
                        # Map to our application classes
                        mapped_class = self.class_mapping.get(class_name.lower(), 'unknown')
                        
                        # Only include target classes
                        if mapped_class in ['person', 'vehicle', 'drone', 'weapon']:
                            # Get bounding box coordinates
                            xyxy = box.xyxy[0].tolist()
                            x1, y1, x2, y2 = map(int, xyxy)
                            
                            detection = {
                                'id': f"{mapped_class}_{int(time.time() * 1000)}_{len(detections)}",
                                'type': mapped_class,
                                'confidence': confidence,
                                'bbox': {
                                    'x': x1,
                                    'y': y1,
                                    'width': x2 - x1,
                                    'height': y2 - y1
                                },
                                'timestamp': time.time(),
                                'original_class': class_name
                            }
                            
                            detections.append(detection)
            
            return detections
            
        except Exception as e:
            logger.error(f"Error during object detection: {e}")
            return []
    
    def draw_detections(self, image: np.ndarray, detections: List[Dict]) -> np.ndarray:
        """Draw bounding boxes and labels on the image"""
        try:
            # Color mapping for different object types
            colors = {
                'person': (0, 255, 0),      # Green
                'vehicle': (255, 0, 0),     # Blue
                'drone': (0, 165, 255),     # Orange
                'weapon': (0, 0, 255),      # Red
                'unknown': (128, 128, 128)  # Gray
            }
            
            for detection in detections:
                bbox = detection['bbox']
                obj_type = detection['type']
                confidence = detection['confidence']
                
                # Get color for this object type
                color = colors.get(obj_type, colors['unknown'])
                
                # Draw bounding box
                cv2.rectangle(
                    image, 
                    (bbox['x'], bbox['y']), 
                    (bbox['x'] + bbox['width'], bbox['y'] + bbox['height']), 
                    color, 
                    2
                )
                
                # Draw label with confidence
                label = f"{obj_type} {confidence:.2f}"
                label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
                
                # Draw label background
                cv2.rectangle(
                    image,
                    (bbox['x'], bbox['y'] - label_size[1] - 10),
                    (bbox['x'] + label_size[0], bbox['y']),
                    color,
                    -1
                )
                
                # Draw label text
                cv2.putText(
                    image,
                    label,
                    (bbox['x'], bbox['y'] - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (255, 255, 255),
                    2
                )
            
            return image
            
        except Exception as e:
            logger.error(f"Error drawing detections: {e}")
            return image

# Initialize YOLO detector with custom model path
import os

# Try to find the custom trained model
custom_model_paths = [
    "custom_model.pt",  # Copied by setup script
    "../yolo/runs/detect/detect3_resume2/weights/best.pt",
    "yolo/runs/detect/detect3_resume2/weights/best.pt",
    "../yolo/best.pt",
    "yolo/best.pt"
]

model_path = "yolov8n.pt"  # Default fallback
for path in custom_model_paths:
    if os.path.exists(path):
        model_path = path
        logger.info(f"Found custom model at: {path}")
        break
else:
    logger.info("Using default YOLOv8 model")

detector = YOLODetector(model_path)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': detector.model is not None,
        'timestamp': time.time()
    })

@app.route('/detect', methods=['POST'])
def detect_objects():
    """Main object detection endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Get image data and confidence threshold
        image_data = data['image']
        confidence_threshold = data.get('confidence', 0.5)
        camera_id = data.get('camera_id', 'unknown')
        
        # Preprocess image
        image = detector.preprocess_image(image_data)
        
        # Perform detection
        detections = detector.detect_objects(image, confidence_threshold)
        
        # Calculate counts
        counts = {
            'persons': len([d for d in detections if d['type'] == 'person']),
            'vehicles': len([d for d in detections if d['type'] == 'vehicle']),
            'drones': len([d for d in detections if d['type'] == 'drone']),
            'weapons': len([d for d in detections if d['type'] == 'weapon'])
        }
        
        # Identify threats (person, drone, weapon)
        threats = [d for d in detections if d['type'] in ['person', 'drone', 'weapon']]
        
        response = {
            'success': True,
            'camera_id': camera_id,
            'detections': detections,
            'counts': counts,
            'threats': threats,
            'timestamp': time.time(),
            'total_detections': len(detections)
        }
        
        logger.info(f"Detection completed for camera {camera_id}: {counts}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in detect_objects endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/detect_with_visualization', methods=['POST'])
def detect_with_visualization():
    """Object detection with visual bounding boxes"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Get image data and confidence threshold
        image_data = data['image']
        confidence_threshold = data.get('confidence', 0.5)
        camera_id = data.get('camera_id', 'unknown')
        
        # Preprocess image
        image = detector.preprocess_image(image_data)
        
        # Perform detection
        detections = detector.detect_objects(image, confidence_threshold)
        
        # Draw detections on image
        image_with_detections = detector.draw_detections(image.copy(), detections)
        
        # Encode image back to base64
        _, buffer = cv2.imencode('.jpg', image_with_detections)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Calculate counts
        counts = {
            'persons': len([d for d in detections if d['type'] == 'person']),
            'vehicles': len([d for d in detections if d['type'] == 'vehicle']),
            'drones': len([d for d in detections if d['type'] == 'drone']),
            'weapons': len([d for d in detections if d['type'] == 'weapon'])
        }
        
        # Identify threats
        threats = [d for d in detections if d['type'] in ['person', 'drone', 'weapon']]
        
        response = {
            'success': True,
            'camera_id': camera_id,
            'detections': detections,
            'counts': counts,
            'threats': threats,
            'image_with_detections': f"data:image/jpeg;base64,{image_base64}",
            'timestamp': time.time(),
            'total_detections': len(detections)
        }
        
        logger.info(f"Detection with visualization completed for camera {camera_id}: {counts}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in detect_with_visualization endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    try:
        if detector.model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        return jsonify({
            'model_path': detector.model_path,
            'model_names': detector.model.names,
            'target_classes': detector.target_classes,
            'class_mapping': detector.class_mapping,
            'timestamp': time.time()
        })
        
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting YOLO Detection API Server...")
    app.run(host='0.0.0.0', port=5000, debug=True)

