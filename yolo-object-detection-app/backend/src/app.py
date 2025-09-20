from flask import Flask, request, jsonify
import cv2
import numpy as np
from yolo.detect_motion_yolo import detect_objects

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():
    if 'camera_feed' not in request.files:
        return jsonify({'error': 'No camera feed provided'}), 400

    camera_feed = request.files['camera_feed']
    # Convert the camera feed to a format suitable for processing
    nparr = np.fromstring(camera_feed.read(), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Perform object detection
    detections = detect_objects(frame)

    return jsonify(detections)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)