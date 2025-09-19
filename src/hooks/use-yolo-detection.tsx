import { useState, useEffect, useRef, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

export interface DetectedObject {
  id: string;
  type: "person" | "vehicle" | "drone" | "weapon" | "unknown";
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: Date;
}

export interface ObjectDetectionResult {
  objects: DetectedObject[];
  counts: {
    persons: number;
    vehicles: number;
    drones: number;
    weapons: number;
  };
  threats: DetectedObject[];
}

export interface UseYoloDetectionReturn {
  detectionResult: ObjectDetectionResult | null;
  isDetecting: boolean;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
  isModelLoaded: boolean;
}

// COCO class names for YOLO detection
const COCO_CLASSES = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
];

export function useYoloDetection(
  videoRef: React.RefObject<HTMLVideoElement>
): UseYoloDetectionReturn {
  const [detectionResult, setDetectionResult] =
    useState<ObjectDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas for image processing
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvasRef.current = canvas;
  }, []);

  // Load YOLO v8 model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading YOLO v8 model...");

        // Load COCO-SSD model (similar to YOLO v8)
        const model = await tf.loadLayersModel(
          "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1"
        );
        modelRef.current = model;
        setIsModelLoaded(true);
        console.log("YOLO v8 model loaded successfully!");
      } catch (err) {
        console.error("Error loading YOLO v8 model:", err);
        setError("Failed to load YOLO v8 model");
      }
    };

    loadModel();
  }, []);

  // YOLO v8 object detection
  const detectObjects = useCallback(async () => {
    if (
      !videoRef.current ||
      !isDetecting ||
      !modelRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to tensor
      const imageTensor = tf.browser.fromPixels(canvas);
      const resized = tf.image.resizeBilinear(imageTensor, [300, 300]);
      const batched = resized.expandDims(0);
      const normalized = batched.div(255.0);

      // Run YOLO v8 inference
      const predictions = (await modelRef.current!.predict(
        normalized
      )) as tf.Tensor;
      const predictionsArray = (await predictions.array()) as number[][][];

      // Clean up tensors
      imageTensor.dispose();
      resized.dispose();
      batched.dispose();
      normalized.dispose();
      predictions.dispose();

      // Process YOLO v8 predictions
      const detectedObjects: DetectedObject[] = [];
      const detectionThreshold = 0.5;

      if (predictionsArray[0]) {
        for (let i = 0; i < predictionsArray[0].length; i++) {
          const prediction = predictionsArray[0][i];
          const [y1, x1, y2, x2, confidence, classIndex] = prediction;

          if (
            confidence > detectionThreshold &&
            classIndex < COCO_CLASSES.length
          ) {
            const className = COCO_CLASSES[Math.floor(classIndex)];

            // Map COCO classes to our categories
            let mappedType: DetectedObject["type"] = "unknown";
            if (className === "person") {
              mappedType = "person";
            } else if (
              ["car", "truck", "bus", "motorcycle", "bicycle"].includes(
                className
              )
            ) {
              mappedType = "vehicle";
            } else if (className === "airplane") {
              mappedType = "drone";
            } else if (["knife", "scissors"].includes(className)) {
              mappedType = "weapon";
            }

            if (mappedType !== "unknown") {
              const bbox = {
                x: x1 * canvas.width,
                y: y1 * canvas.height,
                width: (x2 - x1) * canvas.width,
                height: (y2 - y1) * canvas.height,
              };

              detectedObjects.push({
                id: `obj_${Date.now()}_${i}`,
                type: mappedType,
                confidence: confidence,
                bbox,
                timestamp: new Date(),
              });
            }
          }
        }
      }

      // Calculate counts
      const counts = {
        persons: detectedObjects.filter((obj) => obj.type === "person").length,
        vehicles: detectedObjects.filter((obj) => obj.type === "vehicle")
          .length,
        drones: detectedObjects.filter((obj) => obj.type === "drone").length,
        weapons: detectedObjects.filter((obj) => obj.type === "weapon").length,
      };

      const threats = detectedObjects.filter(
        (obj) =>
          obj.type === "person" || obj.type === "drone" || obj.type === "weapon"
      );

      const result: ObjectDetectionResult = {
        objects: detectedObjects,
        counts,
        threats,
      };

      console.log("YOLO v8 detection result:", result);
      setDetectionResult(result);
    } catch (err) {
      console.error("YOLO v8 detection error:", err);
      setError("Object detection failed");
    }
  }, [videoRef, isDetecting]);

  const startDetection = useCallback(() => {
    if (isDetecting || !isModelLoaded) return;

    console.log("Starting YOLO v8 object detection...");
    setIsDetecting(true);
    setError(null);

    // Start detection every 300ms for real-time detection
    detectionIntervalRef.current = setInterval(detectObjects, 300);
  }, [isDetecting, isModelLoaded, detectObjects]);

  const stopDetection = useCallback(() => {
    console.log("Stopping YOLO v8 object detection...");
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  return {
    detectionResult,
    isDetecting,
    error,
    startDetection,
    stopDetection,
    isModelLoaded,
  };
}



