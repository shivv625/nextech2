# YOLO Object Detection App - Backend

## Overview
This backend application is designed to perform real-time object detection using the YOLO (You Only Look Once) model. It processes video streams from multiple cameras and identifies various objects such as persons, weapons, drones, and vehicles.

## Project Structure
- **src/**: Contains the main application code.
  - **app.py**: The main entry point for the backend application. Initializes the Flask app and sets up routes for object detection.
  - **yolo/**: Contains the YOLO model and detection scripts.
    - **detect_image.py**: Functions for object detection on static images.
    - **detect_motion_yolo.py**: Processes video streams for real-time object detection.
    - **yolov8n.pt**: Pre-trained YOLO model file.
  - **utils/**: Contains utility functions (currently empty).

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd yolo-object-detection-app/backend
   ```

2. **Install dependencies**:
   Ensure you have Python 3.7 or higher installed. Then, install the required packages using pip:
   ```
   pip install -r requirements.txt
   ```

3. **Run the application**:
   Start the Flask server:
   ```
   python src/app.py
   ```

4. **Access the API**:
   The backend will be running on `http://localhost:5000`. You can send requests to the defined endpoints for object detection.

## Usage
- The backend listens for incoming requests from the frontend, processes the video streams from the cameras, and returns the detected objects with labels.
- Ensure that the cameras are properly configured to stream video to the backend.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.