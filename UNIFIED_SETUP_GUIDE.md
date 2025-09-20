# RAKSHAK AI Watch - Unified Single Localhost Setup

## \ud83c\udf86 **NEW: Single Localhost Integration with Socket.IO**

The RAKSHAK AI Watch system now runs on a **single localhost** with **real-time Socket.IO communication** between frontend and backend!

---

## \ud83d\ude80 **One-Click Startup**

### **Super Simple Method**

Just double-click this file:

```
start_unified.bat
```

**That's it!** The system will:

1. \u2705 Install all dependencies (Python + Node.js)
2. \u2705 Build the React frontend for production
3. \u2705 Start the unified server with Socket.IO
4. \u2705 Serve everything on **http://localhost:5000**

---

## \ud83c\udfa5 **What You Get**

### **Single Localhost Access**

- **Frontend:** http://localhost:5000
- **Backend API:** http://localhost:5000/api/...
- **Socket.IO:** Real-time websocket communication
- **YOLO Detection:** Integrated seamlessly

### **Real-time Features**

- \ud83d\udcf5 **Live detection updates** via Socket.IO
- \ud83d\udea8 **Instant threat alerts** across all cameras
- \ud83d\udd17 **Real-time connection status** indicators
- \ud83d\udce1 **Automatic reconnection** if connection drops

### **4-Camera System**

- \ud83d\udcf9 **Camera 1:** Sector B-12 (Night Vision + YOLO)
- \ud83d\udcf9 **Camera 2:** Main Checkpoint (YOLO)
- \ud83d\udcf9 **Camera 3:** Patrol Route (YOLO)
- \ud83d\udcf9 **Camera 4:** Command Outpost (YOLO)

---

## \ud83d\udee0\ufe0f **Manual Setup (Alternative)**

### **Step 1: Install Dependencies**

```cmd
cd \"d:\\hello\\rakshak-ai-watch-main\"
call venv\\Scripts\\activate.bat
cd backend
pip install -r requirements.txt
cd ..
npm install
```

### **Step 2: Start Unified Server**

```cmd
cd backend
python unified_server.py
```

### **Step 3: Access Application**

```
http://localhost:5000
```

---

## \ud83d\udd0c **Socket.IO Integration Details**

### **Real-time Events**

**Detection Updates:**

```javascript
// Real-time object detection data
socket.on("detection_update", (data) => {
  console.log("Camera:", data.camera_id);
  console.log("Objects:", data.detections);
  console.log("Counts:", data.counts);
});
```

**Threat Alerts:**

```javascript
// Immediate threat notifications
socket.on("threat_alert", (data) => {
  console.log("THREAT:", data.threats);
  console.log("Location:", data.location);
});
```

**Connection Status:**

```javascript
// Socket.IO connection events
socket.on("connect", () => {
  console.log("\u2705 Connected to server");
});

socket.on("disconnect", () => {
  console.log("\u274c Disconnected from server");
});
```

### **Backend Socket.IO Events**

**Server emits:**

- `detection_update` - Real-time YOLO detection results
- `threat_alert` - Immediate threat notifications
- `status` - Server and model status updates

**Client can emit:**

- `start_detection` - Start detection for specific camera
- `stop_detection` - Stop detection for specific camera

---

## \ud83c\udfa7 **Architecture Overview**

```
\ud83c\udf10 Single Localhost (http://localhost:5000)
\u2502
\u251c\u2500\u2500 \ud83d\udcf1 React Frontend (Built & Served)
\u2502   \u251c\u2500\u2500 4 Camera VideoFeed Components
\u2502   \u251c\u2500\u2500 Socket.IO Client Integration
\u2502   \u2514\u2500\u2500 Real-time UI Updates
\u2502
\u251c\u2500\u2500 \u2699\ufe0f Flask Backend API
\u2502   \u251c\u2500\u2500 YOLO Detection Endpoints
\u2502   \u251c\u2500\u2500 Socket.IO Server
\u2502   \u2514\u2500\u2500 Static File Serving
\u2502
\u2514\u2500\u2500 \ud83e\udd16 YOLO Model Integration
    \u251c\u2500\u2500 Custom Trained Model
    \u251c\u2500\u2500 Real-time Object Detection
    \u2514\u2500\u2500 Auto-threat Classification
```

---

## \ud83d\udcca **Performance Benefits**

### **Single Localhost Advantages**

- \u2b50 **No CORS issues** - Everything on same origin
- \u2b50 **Faster communication** - No cross-origin requests
- \u2b50 **Simplified deployment** - One server to manage
- \u2b50 **Better security** - No external API calls

### **Socket.IO Benefits**

- \u26a1 **Real-time updates** - Instant threat notifications
- \u26a1 **Low latency** - Websocket communication
- \u26a1 **Auto-reconnection** - Handles network interruptions
- \u26a1 **Bidirectional** - Server and client can communicate

---

## \ud83d\udd0d **Troubleshooting**

### **If Port 5000 is Busy**

```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### **If Dependencies Fail**

```cmd
# Python dependencies
pip install flask-socketio python-socketio

# Node.js dependencies
npm install socket.io-client
```

### **If Build Fails**

```cmd
# Clear caches and rebuild
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

### **Check Logs**

- Backend logs show in terminal
- Frontend logs in browser console (F12)
- Socket.IO connection status in browser console

---

## \ud83c\udfc5 **Expected Results**

### **\u2705 Successful Startup**

```
\ud83d\ude80 RAKSHAK AI Watch - Unified Server Startup
\u2705 Python dependencies installed
\u2705 Node.js dependencies installed
\u2705 Frontend built successfully
\u2705 YOLO model loaded
\ud83d\udce1 Server URL: http://localhost:5000
\ud83c\udfa5 YOLO Detection: \u2705 ENABLED
\ud83d\udd17 Socket.IO: \u2705 ENABLED
\ud83d\udcf1 Frontend: \u2705 SERVED FROM BACKEND
```

### **\u2705 Browser Interface**

- Login page at http://localhost:5000
- 4 camera feeds with real-time detection
- Socket.IO connection indicators
- Real-time threat alerts
- Live object counters

### **\u2705 Real-time Features Working**

- Green \"Socket.IO\" badges on camera feeds
- Instant detection updates without refresh
- Automatic threat alerts in sidebar
- Live object counting (\"2P 1V 0D 1W\")

---

## \ud83c\udf89 **Success!**

**Your unified RAKSHAK AI Watch system is now running on a single localhost with:**

- \u2705 **Single URL access** (http://localhost:5000)
- \u2705 **Real-time Socket.IO communication**
- \u2705 **4-camera YOLO detection**
- \u2705 **Instant threat alerts**
- \u2705 **Production-ready frontend**
- \u2705 **Unified server management**

**\ud83d\ude80 Ready for real-time surveillance and threat detection!**", "original_text": "", "replace_all": false}]
