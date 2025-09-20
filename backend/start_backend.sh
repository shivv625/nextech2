#!/bin/bash

echo "Starting YOLO Detection Backend..."
echo

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "yolo_detection.py" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Check if YOLO model exists
if [ ! -f "../yolo/yolov8n.pt" ]; then
    echo "Error: YOLO model not found"
    echo "Please ensure yolov8n.pt is in the yolo/ directory"
    exit 1
fi

echo "Installing dependencies..."
python3 -m pip install -r requirements.txt

echo
echo "Starting YOLO Detection Backend Server..."
echo "Server will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo

python3 yolo_detection.py

