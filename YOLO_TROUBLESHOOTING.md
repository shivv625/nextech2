# YOLO Detection Troubleshooting Guide

## \ud83d\udea8 **Issue: YOLO Not Detecting Objects or Labeling**

### **\ud83d\udd0d Quick Diagnostics**

#### **Step 1: Test Backend Health**

Open browser and check: `http://localhost:5000/health`

Expected response:

```json
{
  \"status\": \"healthy\",
  \"model_loaded\": true,
  \"model_info\": {
    \"model_path\": \"...\",
    \"model_classes\": [...],
    \"class_mapping\": {...}
  },
  \"timestamp\": 1234567890
}
```

#### **Step 2: Check Browser Console**

1. Open browser (F12 \u2192 Console)
2. Look for these messages:
   - \u2705 `\"Backend health response: {...}\"`
   - \u2705 `\"YOLO model is loaded and ready\"`
   - \u274c `\"Backend server not available\"`
   - \u274c `\"YOLO model not loaded on backend\"`

#### **Step 3: Check Camera Feed Status**

Look for these indicators on each camera:

- \ud83d\udfe2 \"YOLO v8 ACTIVE\" (green badge)
- \ud83d\udd34 \"YOLO v8 OFF\" (gray badge)
- \ud83d\udfe1 \"Loading YOLO v8...\" (spinning)

---

## \ud83d\udee0\ufe0f **Common Fixes**

### **Fix 1: Backend Not Running**

**Problem:** Backend server is not started

**Solution:**

```cmd
cd \"d:\\hello\\rakshak-ai-watch-main\\backend\"
call ..\\venv\\Scripts\\activate.bat
python unified_server.py
```

**Expected Output:**

```
\ud83d\ude80 RAKSHAK AI Watch - Unified Server Startup
\u2705 Python dependencies installed
\u2705 Frontend built successfully
\u2705 YOLO model loaded
\ud83d\udce1 Server URL: http://localhost:5000
```

### **Fix 2: YOLO Model Not Found**

**Problem:** Custom YOLO model not found

**Check Model Locations:**

```cmd
# Check if custom model exists
dir \"d:\\hello\\rakshak-ai-watch-main\\yolo\\runs\\detect\\detect3_resume2\\weights\\best.pt\"

# Check backend model
dir \"d:\\hello\\rakshak-ai-watch-main\\backend\\custom_model.pt\"
```

**Solution:**

```cmd
# Copy your custom model to backend
copy \"d:\\hello\\rakshak-ai-watch-main\\yolo\\runs\\detect\\detect3_resume2\\weights\\best.pt\" \"d:\\hello\\rakshak-ai-watch-main\\backend\\custom_model.pt\"
```

### **Fix 3: Dependencies Missing**

**Problem:** Required packages not installed

**Solution:**

```cmd
cd \"d:\\hello\\rakshak-ai-watch-main\\backend\"
call ..\\venv\\Scripts\\activate.bat
pip install -r requirements.txt

# Specifically install YOLO packages
pip install ultralytics==8.0.196
pip install opencv-python==4.8.1.78
pip install flask-socketio==5.3.6
```

### **Fix 4: Port Conflicts**

**Problem:** Port 5000 is busy

**Check and Kill Process:**

```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### **Fix 5: Frontend Not Built**

**Problem:** Frontend not built for production

**Solution:**

```cmd
cd \"d:\\hello\\rakshak-ai-watch-main\"
npm install
npm run build
```

**Expected Output:**

```
\u2705 dist/index.html created
\u2705 dist/assets/* created
```

---

## \ud83d\udcca **Manual Testing Commands**

### **Test 1: Backend API Direct**

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected: {\"status\":\"healthy\",\"model_loaded\":true,...}
```

### **Test 2: YOLO Model Loading**

```cmd
cd \"d:\\hello\\rakshak-ai-watch-main\\backend\"
call ..\\venv\\Scripts\\activate.bat
python -c \"from ultralytics import YOLO; model = YOLO('yolov8n.pt'); print('Model loaded:', model.names)\"
```

### **Test 3: Frontend Build**

```cmd
cd \"d:\\hello\\rakshak-ai-watch-main\"
npm run build
dir dist
```

---

## \ud83d\udd27 **Advanced Debugging**

### **Enable Verbose Logging**

Add to `yolo_detection.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### **Test Detection Manually**

1. **Open Browser Console (F12)**
2. **Run Manual Detection Test:**

```javascript
// Test detection API manually
fetch("http://localhost:5000/health")
  .then((response) => response.json())
  .then((data) => console.log("Health:", data));

// Test detection endpoint
const testImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...";
fetch("http://localhost:5000/detect", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    image: testImage,
    confidence: 0.3,
    camera_id: "test",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("Detection:", data));
```

### **Check Console Logs**

**Expected Frontend Console Messages:**

```
\ud83d\udd0d Checking backend health at: http://localhost:5000/health
\u2705 Backend health response: {status: \"healthy\", model_loaded: true}
\u2705 YOLO model is loaded and ready
\ud83d\udcf8 Sending detection request for CAM-007...
\ud83d\udcca Detection response for CAM-007: {success: true, detections: [...]}
\ud83c\udfaf CAM-007 detected: {total: 2, persons: 1, vehicles: 1, ...}
```

**Expected Backend Console Messages:**

```
INFO:__main__:\u2705 Custom trained YOLO model loaded successfully
INFO:werkzeug: * Running on http://0.0.0.0:5000
INFO:__main__:\ud83d\udcca Health check - Model loaded: True
INFO:__main__:Detection completed for camera CAM-007: {'persons': 1, 'vehicles': 1, ...}
```

---

## \ud83d\udc1b **Common Error Messages & Solutions**

### **Error: \"Backend server not available\"**

**Cause:** Backend not running
**Fix:** Start unified server: `python unified_server.py`

### **Error: \"YOLO model not loaded on backend\"**

**Cause:** Model file missing or corrupted
**Fix:** Copy model file or use default: `YOLO('yolov8n.pt')`

### **Error: \"HTTP error! status: 500\"**

**Cause:** Backend processing error
**Fix:** Check backend console for detailed error

### **Error: \"Failed to capture frame\"**

**Cause:** Camera not streaming or video element empty
**Fix:** Ensure camera permissions granted and video is playing

### **Error: \"No objects detected\"**

**Cause:** Detection threshold too high or no objects in frame
**Fix:** Lower confidence threshold to 0.3 or test with objects in frame

---

## \u2705 **Success Indicators**

### **Backend Working:**

- \u2713 Server starts without errors
- \u2713 `/health` returns `model_loaded: true`
- \u2713 Console shows \"YOLO model loaded successfully\"

### **Frontend Working:**

- \u2713 Camera feeds show video
- \u2713 Green \"YOLO v8 ACTIVE\" badges visible
- \u2713 Browser console shows successful health checks
- \u2713 Detection requests being sent every 500ms

### **Detection Working:**

- \u2713 Bounding boxes appear around objects
- \u2713 Labels show object type and confidence
- \u2713 Object counters update (\"2P 1V 0D 1W\")
- \u2713 Console shows \"detected: {total: X, persons: Y, ...}\"

---

## \ud83d\ude91 **Emergency Reset**

If nothing works, try complete reset:

```cmd
# 1. Stop all servers
taskkill /f /im python.exe
taskkill /f /im node.exe

# 2. Clean rebuild
cd \"d:\\hello\\rakshak-ai-watch-main\"
rmdir /s /q node_modules
rmdir /s /q dist
npm cache clean --force
npm install
npm run build

# 3. Reinstall Python packages
cd backend
call ..\\venv\\Scripts\\activate.bat
pip uninstall -y ultralytics flask-socketio
pip install -r requirements.txt

# 4. Start fresh
python unified_server.py
```

---

## \ud83d\udcde **Still Not Working?**

1. **Check your custom YOLO model file exists and is valid**
2. **Try with default YOLOv8 model first** (comment out custom model path)
3. **Test with webcam directly** (ensure camera permissions)
4. **Check firewall/antivirus** blocking port 5000
5. **Try different browser** (Chrome recommended)

**\ud83d\ude80 Follow this guide step by step and your YOLO detection will work!**", "original_text": "", "replace_all": false}]
