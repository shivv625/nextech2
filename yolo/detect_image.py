import cv2
from ultralytics import YOLO

# Load the trained YOLOv8 model (use the path to your best weights file)
model = YOLO("runs/detect/detect3_resume2/weights/best.pt")

# Read an image
image_path = "path_to_image.jpg"  # replace with the actual image path
image = cv2.imread(image_path)

# Perform inference on the image
results = model(image)

# Loop through results and remap 'aeroplane' to 'drone'
for result in results:
    for box in result.boxes:
        cls = int(box.cls[0])
        name = model.names[cls]

        # Remap 'aeroplane' to 'drone'
        if name.lower() in ["aeroplane", "airplane"]:
            name = "drone"

        conf = float(box.conf[0])
        xyxy = box.xyxy[0].tolist()
        x1, y1, x2, y2 = map(int, xyxy)

        label = f"{name} {conf:.2f}"
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, label, (x1, max(15, y1-6)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

# Show the processed image
cv2.imshow("Detection", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
