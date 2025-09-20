# YOLO Object Detection Application

This project implements a YOLO (You Only Look Once) object detection application that processes live camera feeds to identify various objects such as persons, weapons, drones, and vehicles. The application is structured into a backend and a frontend, allowing for seamless integration and real-time object detection.

## Project Structure

```
yolo-object-detection-app
├── backend
│   ├── src
│   │   ├── app.py
│   │   ├── yolo
│   │   │   ├── detect_image.py
│   │   │   ├── detect_motion_yolo.py
│   │   │   └── yolov8n.pt
│   │   └── utils
│   │       └── __init__.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── CameraPreview.jsx
│   │   │   └── DetectionLabel.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── README.md
└── .vscode
    └── settings.json
```

## Backend

The backend is built using Flask and is responsible for handling object detection requests. It includes:

- **app.py**: The main entry point for the backend application. It initializes the Flask app and sets up routes for object detection.
- **yolo/detect_image.py**: Contains functions for performing object detection on static images.
- **yolo/detect_motion_yolo.py**: Processes video streams from cameras for real-time object detection.
- **yolo/yolov8n.pt**: The pre-trained YOLO model file used for object detection.
- **utils/__init__.py**: An empty initialization file for utility functions.
- **requirements.txt**: Lists the Python dependencies required for the backend.

## Frontend

The frontend is built using React and provides a user interface for displaying live camera feeds and detected objects. It includes:

- **components/CameraPreview.jsx**: Displays the live camera feed and connects to the backend for object detection results.
- **components/DetectionLabel.jsx**: Displays labels for detected objects on the screen.
- **App.jsx**: The main component that integrates the CameraPreview and DetectionLabel components.
- **index.js**: The entry point for the React application.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install the required dependencies using:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend application:
   ```
   python src/app.py
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install the required dependencies using:
   ```
   npm install
   ```
3. Start the frontend application:
   ```
   npm start
   ```

## Usage

Once both the backend and frontend are running, you can access the application through your web browser. The live camera feeds will be displayed, and detected objects will be labeled in real-time.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and contributions are welcome!