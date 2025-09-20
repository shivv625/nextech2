import cv2
import torch

class YoloMotionDetector:
    def __init__(self, model_path, confidence_threshold=0.5):
        self.model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=True)
        self.confidence_threshold = confidence_threshold

    def process_frame(self, frame):
        results = self.model(frame)
        detections = results.xyxy[0]  # Get detections
        detected_objects = []

        for *box, conf, cls in detections:
            if conf >= self.confidence_threshold:
                label = self.model.names[int(cls)]
                detected_objects.append({
                    'label': label,
                    'confidence': conf.item(),
                    'bbox': [int(x) for x in box]
                })

        return detected_objects

    def start_detection(self, camera_index=0):
        cap = cv2.VideoCapture(camera_index)

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            detections = self.process_frame(frame)

            for obj in detections:
                x1, y1, x2, y2 = obj['bbox']
                label = obj['label']
                confidence = obj['confidence']
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(frame, f'{label} {confidence:.2f}', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

            cv2.imshow('YOLO Object Detection', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    model_path = 'yolov8n.pt'  # Path to the YOLO model
    detector = YoloMotionDetector(model_path)
    detector.start_detection()