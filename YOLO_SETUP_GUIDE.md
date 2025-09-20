# YOLO Integration Setup & Usage Guide

## 🎯 Overview

This guide explains how to use the integrated YOLO object detection system with your 4-camera surveillance setup. The system can detect **persons, vehicles, drones, and weapons** in real-time across all camera feeds.

## 🚀 Quick Start

### Method 1: Using Batch Scripts (Recommended)

1. **Start Backend Server:**

   ```cmd
   double-click: start_rakshak_backend.bat
   ```

2. **Start Frontend (in new terminal):**

   ```cmd
   double-click: start_rakshak_frontend.bat
   ```

3. **Access Application:**
   - Open browser: `http://localhost:8087`
   - Login with any credentials
   - All 4 cameras will have YOLO detection enabled

### Method 2: Manual Setup

1. **Backend Setup:**

   ```cmd
   cd backend
   pip install -r requirements.txt
   python yolo_detection.py
   ```

2. **Frontend Setup:**
   ```cmd
   npm install
   npm run dev
   ```

## 🎥 Camera Configuration

### Current Setup (Index.tsx)

```typescript
// Camera 1: Sector B-12 (Night Vision + Detection)
<VideoFeed
  feedId="CAM-007"
  cameraIndex={0}
  enableObjectDetection={true}
  enableNightVision={true}
/>

// Camera 2: Main Checkpoint (Detection)
<VideoFeed
  feedId="CAM-003"
  cameraIndex={1}
  enableObjectDetection={true}
/>

// Camera 3: Patrol Route (Detection)
<VideoFeed
  feedId="CAM-012"
  cameraIndex={2}
  enableObjectDetection={true}
/>

// Camera 4: Command Outpost (Detection)
<VideoFeed
  feedId="CAM-018"
  cameraIndex={3}
  enableObjectDetection={true}
/>
```

## 🔧 YOLO Model Configuration

### Custom Model Integration

The system automatically looks for your custom trained YOLO model in these locations:

1. `yolo/runs/detect/detect3_resume2/weights/best.pt` (Primary)
2. `backend/custom_model.pt` (Copied by setup script)
3. `yolo/best.pt` (Alternative)
4. `yolov8n.pt` (Default fallback)

### Detection Classes

| Original Class              | Mapped To | Color    | Alert Level |
| --------------------------- | --------- | -------- | ----------- |
| person                      | person    | Red      | High        |
| car, truck, bus, motorcycle | vehicle   | Blue     | Medium      |
| airplane, aeroplane         | drone     | Orange   | Medium      |
| gun, pistol, knife, weapon  | weapon    | Dark Red | Critical    |

## 🎯 Object Detection Features

### Real-time Detection

- **Detection Interval:** 500ms per camera
- **Confidence Threshold:** 40% (adjustable)
- **Visual Indicators:** Bounding boxes with labels
- **Live Counting:** Persons, Vehicles, Drones, Weapons

### Alert System

- **Auto-generated alerts** for detected threats
- **Severity levels:** Critical (weapons) → High (persons) → Medium (drones/vehicles)
- **Location tracking** with camera identification
- **Real-time notifications** in dashboard

## 📊 API Endpoints

### Backend (http://localhost:5000)

```http
GET /health
# Check server and model status

POST /detect
# Basic object detection
Body: {
  "image": "base64_image_data",
  "confidence": 0.4,
  "camera_id": "CAM-007"
}

POST /detect_with_visualization
# Detection with visual overlays
Body: {
  "image": "base64_image_data",
  "confidence": 0.4,
  "camera_id": "CAM-007"
}

GET /model_info
# Get loaded model information
```

## 🎛️ Camera Controls

### Individual Camera Controls

- **Play/Pause:** Start/stop video feed
- **Camera Selection:** Switch between available cameras
- **Night Vision:** Toggle green-tint night vision mode
- **Detection Toggle:** Enable/disable YOLO detection
- **Full Screen:** Expand camera view

### Object Detection Controls

- **Auto-start:** Detection starts automatically when camera is live
- **Visual Indicators:**
  - 🔴 Person detected
  - 🔵 Vehicle detected
  - 🟠 Drone detected
  - 🔴 Weapon detected (Critical)

## 🚨 Alert Management

### Automatic Alerts

```javascript
// Example alert generation
{
  type: "weapon" | "intrusion" | "drone" | "system",
  severity: "critical" | "high" | "medium" | "low",
  title: "Weapon Detected",
  description: "AI detected weapon with 87% confidence on Sector B-12",
  location: "Border Fence North",
  source: "Camera Feed CAM-007",
  cameraId: "CAM-007"
}
```

### Alert Levels

- **Critical:** Weapons detected (immediate response required)
- **High:** Persons detected in restricted areas
- **Medium:** Drones or suspicious vehicles
- **Low:** General system notifications

## 🔧 Troubleshooting

### Backend Issues

**Model Not Loading:**

```bash
# Check if model exists
ls yolo/runs/detect/detect3_resume2/weights/best.pt

# Check backend logs
python yolo_detection.py
```

**Dependencies Issues:**

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Issues

**Camera Not Working:**

- Grant camera permissions in browser
- Check if multiple cameras are available
- Verify camera index assignment

**Detection Not Starting:**

- Ensure backend is running on port 5000
- Check browser console for API errors
- Verify model is loaded in backend

### Common Fixes

1. **CORS Errors:**

   - Backend includes CORS headers
   - Make sure both servers are running

2. **Performance Issues:**

   - Reduce detection frequency in `use-yolo-detection-real.tsx`
   - Lower confidence threshold if needed
   - Disable detection on unused cameras

3. **Model Path Issues:**
   - Run setup script to copy model
   - Check file permissions
   - Verify model file integrity

## 📈 Performance Optimization

### Detection Settings

```typescript
// In use-yolo-detection-real.tsx
const DETECTION_INTERVAL = 500; // milliseconds
const CONFIDENCE_THRESHOLD = 0.4; // 40%
const VIDEO_DIMENSIONS = { width: 640, height: 480 };
```

### Resource Management

- **CPU Usage:** Monitor with Task Manager
- **Memory Usage:** Detection results are cached briefly
- **Network:** Base64 image transmission (consider optimization)

## 🔒 Security Considerations

- **Local Processing:** All detection happens locally
- **No Cloud Dependencies:** YOLO runs on local hardware
- **Camera Access:** Requires user permission
- **Data Privacy:** No images are stored or transmitted externally

## 📱 Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Edge 90+
- ⚠️ Safari (limited camera support)

### Required Permissions

- Camera access
- Microphone access (for some camera devices)
- Local storage (for preferences)

## 🎯 Next Steps

1. **Test All Cameras:** Verify each camera feed shows detection
2. **Adjust Thresholds:** Fine-tune confidence levels
3. **Monitor Performance:** Check CPU/memory usage
4. **Customize Alerts:** Modify alert types and severities
5. **Add More Classes:** Extend detection to other objects

## 📞 Support

If you encounter issues:

1. Check console logs (F12 in browser)
2. Verify backend API is responding: `http://localhost:5000/health`
3. Test individual camera feeds
4. Check YOLO model file exists and is accessible

---

**🎉 Your YOLO-integrated surveillance system is now ready!**
