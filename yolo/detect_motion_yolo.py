import cv2
from ultralytics import YOLO

# Load the trained YOLOv8 model
model = YOLO("yolov8n.pt")

# Open video feed (use webcam or video file)
cap = cv2.VideoCapture(0)  # or use "video_path" for a video file

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, conf=0.6)  # Run inference with confidence threshold

    # Process the results
    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]

            # Remap 'aeroplane' to 'drone'
            if name.lower() in ["aeroplane", "airplane"]:
                name = "drone"

            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, xyxy)

            label = f"{name} {conf:.2f}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, max(15, y1-6)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    # Display the live video with detections
    cv2.imshow("YOLOv8 Detection", frame)

    # Press 'q' to quit the live feed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()


