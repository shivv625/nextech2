# YOLO Object Detection Integration

This document explains how to set up and use the YOLO object detection system with the Rakshak AI Watch application.

## 🎯 Overview

The system uses a trained YOLOv8 model to perform real-time object detection on 4 camera feeds, identifying:

- **Person**: Human detection
- **Vehicle**: Cars, trucks, buses, motorcycles, bicycles
- **Drone**: Aircraft (mapped from airplane class)
- **Weapon**: Knives, scissors, guns, pistols

## 🏗️ Architecture

### Backend (Python Flask API)

- **YOLO Model**: Uses `yolov8n.pt` for object detection
- **Real-time Processing**: Processes camera frames every 500ms
- **REST API**: Provides detection endpoints for frontend
- **Visualization**: Returns images with bounding boxes and labels

### Frontend (React)

- **Camera Integration**: Captures frames from 4 camera feeds
- **Real-time Detection**: Sends frames to backend for processing
- **Visual Overlays**: Displays bounding boxes and labels on camera feeds
- **Alert System**: Triggers alerts for detected threats

## 🚀 Quick Start

### 1. Backend Setup

#### Windows:

```bash
cd backend
start_backend.bat
```

#### Linux/Mac:

```bash
cd backend
chmod +x start_backend.sh
./start_backend.sh
```

#### Manual Setup:

```bash
cd backend
pip install -r requirements.txt
python yolo_detection.py
```

### 2. Frontend Setup

```bash
npm run dev
```

### 3. Access the Application

- Open `http://localhost:8087`
- Login as Command Center
- All 4 camera feeds will show real-time YOLO detection

## 📁 File Structure

```
rakshak-ai-watch-main/
├── yolo/
│   ├── yolov8n.pt              # Trained YOLO model
│   ├── detect_image.py         # Image detection script
│   └── detect_motion_yolo.py   # Video detection script
├── backend/
│   ├── yolo_detection.py       # Flask API server
│   ├── requirements.txt        # Python dependencies
│   ├── start_backend.bat       # Windows startup script
│   └── start_backend.sh        # Linux/Mac startup script
└── src/
    ├── hooks/
    │   └── use-yolo-detection-real.tsx  # Frontend YOLO hook
    └── components/
        └── dashboard/
            └── VideoFeed.tsx    # Updated camera component
```

## 🔧 Configuration

### Backend Configuration

The backend can be configured by modifying `yolo_detection.py`:

```python
# Model path
model_path = "yolo/yolov8n.pt"

# Confidence threshold
confidence_threshold = 0.5

# Target classes
target_classes = {
    'person': 0,
    'car': 2, 'truck': 7, 'bus': 5, 'motorcycle': 3, 'bicycle': 1,
    'airplane': 4,  # Mapped to 'drone'
    'knife': 43, 'scissors': 76, 'gun': 28, 'pistol': 28
}
```

### Frontend Configuration

The frontend can be configured by modifying the hook:

```typescript
// Detection interval (milliseconds)
const DETECTION_INTERVAL = 500;

// Confidence threshold
const CONFIDENCE_THRESHOLD = 0.5;

// API endpoint
const API_BASE_URL = "http://localhost:5000";
```

## 🎮 Usage

### Camera Feeds

1. **Camera 1 (CAM-007)**: Night vision + Object detection
2. **Camera 2 (CAM-003)**: Object detection
3. **Camera 3 (CAM-012)**: Object detection
4. **Camera 4 (CAM-018)**: Standard feed

### Object Detection

- **Real-time Processing**: Frames processed every 500ms
- **Visual Overlays**: Bounding boxes with labels and confidence scores
- **Color Coding**:
  - 🟢 Green: Person
  - 🔵 Blue: Vehicle
  - 🟠 Orange: Drone
  - 🔴 Red: Weapon

### Alert System

- **Automatic Alerts**: Generated for detected threats (person, drone, weapon)
- **Real-time Counts**: Displayed in AlertSystem component
- **SOS Integration**: Emergency alerts for critical detections

## 🔌 API Endpoints

### Health Check

```
GET /health
```

Returns server status and model loading status.

### Object Detection

```
POST /detect
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "confidence": 0.5,
  "camera_id": "camera-1"
}
```

### Detection with Visualization

```
POST /detect_with_visualization
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "confidence": 0.5,
  "camera_id": "camera-1"
}
```

### Model Information

```
GET /model_info
```

Returns model details and class mappings.

## 🛠️ Troubleshooting

### Backend Issues

1. **Model Not Loading**:

   - Check if `yolov8n.pt` exists in `yolo/` directory
   - Verify file permissions
   - Check Python dependencies

2. **Dependencies Missing**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Port Already in Use**:
   - Change port in `yolo_detection.py`
   - Kill existing processes on port 5000

### Frontend Issues

1. **Backend Connection Failed**:

   - Check if backend is running on port 5000
   - Verify CORS settings
   - Check network connectivity

2. **Camera Not Working**:

   - Check browser permissions
   - Verify camera access
   - Check HTTPS requirements

3. **Detection Not Working**:
   - Check browser console for errors
   - Verify backend health endpoint
   - Check model loading status

## 📊 Performance

### Detection Speed

- **Processing Time**: ~100-200ms per frame
- **Update Interval**: 500ms (2 FPS)
- **Model Size**: ~6.2MB (yolov8n.pt)

### Resource Usage

- **CPU**: Moderate usage during detection
- **Memory**: ~500MB for model loading
- **GPU**: Optional (CUDA support available)

## 🔒 Security

### API Security

- **CORS**: Configured for localhost development
- **Input Validation**: Image data validation
- **Error Handling**: Comprehensive error responses

### Model Security

- **Local Processing**: All detection happens locally
- **No Data Storage**: Frames are not stored
- **Privacy**: No data sent to external services

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**:

   ```bash
   # Install production dependencies
   pip install gunicorn

   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 yolo_detection:app
   ```

2. **Frontend Deployment**:

   ```bash
   npm run build
   # Deploy dist/ folder to web server
   ```

3. **Environment Variables**:
   ```bash
   export FLASK_ENV=production
   export YOLO_MODEL_PATH=/path/to/yolov8n.pt
   ```

## 📈 Monitoring

### Backend Monitoring

- **Health Endpoint**: `/health`
- **Model Status**: Check model loading status
- **Performance**: Monitor detection times

### Frontend Monitoring

- **Console Logs**: Check browser console
- **Network Tab**: Monitor API calls
- **Detection Status**: Check detection results

## 🔄 Updates

### Model Updates

1. Replace `yolov8n.pt` with new model
2. Update class mappings if needed
3. Restart backend server

### Code Updates

1. Update frontend hook for new features
2. Modify backend API if needed
3. Test integration thoroughly

## 📝 Development

### Adding New Object Classes

1. Update `target_classes` in backend
2. Add class mapping in `class_mapping`
3. Update frontend color coding
4. Test detection accuracy

### Customizing Detection

1. Modify confidence thresholds
2. Adjust detection intervals
3. Update visualization styles
4. Add custom alert logic

---

**Note**: This integration provides real-time object detection using a trained YOLO model. Ensure you have the proper hardware requirements and model file before deployment.

