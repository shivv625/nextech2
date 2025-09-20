from flask import Flask, request, jsonify
import cv2
import torch

app = Flask(__name__)

# Load the YOLO model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolo/yolov8n.pt')

@app.route('/detect', methods=['POST'])
def detect_objects():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Read the image from the file
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # Perform object detection
    results = model(img)

    # Process results
    detections = []
    for *box, conf, cls in results.xyxy[0]:
        detections.append({
            'label': model.names[int(cls)],
            'confidence': conf.item(),
            'bbox': [box[0].item(), box[1].item(), box[2].item(), box[3].item()]
        })

    return jsonify(detections)

if __name__ == '__main__':
    app.run(debug=True)