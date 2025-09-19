import { useState, useEffect, useRef, useCallback } from "react";

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

export interface UseObjectDetectionReturn {
  detectionResult: ObjectDetectionResult | null;
  isDetecting: boolean;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
}

// Mock object detection for demonstration
const MOCK_OBJECTS: DetectedObject[] = [
  {
    id: "obj_001",
    type: "person",
    confidence: 0.92,
    bbox: { x: 100, y: 150, width: 80, height: 120 },
    timestamp: new Date(),
  },
  {
    id: "obj_002",
    type: "vehicle",
    confidence: 0.88,
    bbox: { x: 200, y: 200, width: 150, height: 100 },
    timestamp: new Date(),
  },
  {
    id: "obj_003",
    type: "drone",
    confidence: 0.85,
    bbox: { x: 300, y: 50, width: 60, height: 40 },
    timestamp: new Date(),
  },
];

export function useObjectDetection(
  videoRef: React.RefObject<HTMLVideoElement>
): UseObjectDetectionReturn {
  const [detectionResult, setDetectionResult] =
    useState<ObjectDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const detectObjects = useCallback(async () => {
    if (!isDetecting) {
      console.log("Detection skipped - isDetecting:", isDetecting);
      return;
    }

    try {
      console.log("Running object detection...");

      // Simulate object detection with mock data
      // In real implementation, this would use TensorFlow.js or similar
      const mockObjects = MOCK_OBJECTS.map((obj) => ({
        ...obj,
        id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        bbox: {
          x: Math.random() * 400,
          y: Math.random() * 300,
          width: 50 + Math.random() * 100,
          height: 50 + Math.random() * 100,
        },
        timestamp: new Date(),
      }));

      // Add some random objects to make it more realistic
      const additionalObjects = [];
      if (Math.random() > 0.3) {
        // Increased probability
        additionalObjects.push({
          id: `obj_${Date.now()}_person_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "person" as const,
          confidence: 0.85 + Math.random() * 0.15,
          bbox: {
            x: Math.random() * 400,
            y: Math.random() * 300,
            width: 60 + Math.random() * 80,
            height: 80 + Math.random() * 100,
          },
          timestamp: new Date(),
        });
      }
      if (Math.random() > 0.5) {
        // Increased probability
        additionalObjects.push({
          id: `obj_${Date.now()}_vehicle_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "vehicle" as const,
          confidence: 0.8 + Math.random() * 0.2,
          bbox: {
            x: Math.random() * 400,
            y: Math.random() * 300,
            width: 100 + Math.random() * 120,
            height: 60 + Math.random() * 80,
          },
          timestamp: new Date(),
        });
      }

      const allObjects = [...mockObjects, ...additionalObjects];
      console.log("Detected objects:", allObjects);

      const counts = {
        persons: allObjects.filter((obj) => obj.type === "person").length,
        vehicles: allObjects.filter((obj) => obj.type === "vehicle").length,
        drones: allObjects.filter((obj) => obj.type === "drone").length,
        weapons: allObjects.filter((obj) => obj.type === "weapon").length,
      };

      const threats = allObjects.filter(
        (obj) =>
          obj.type === "person" || obj.type === "drone" || obj.type === "weapon"
      );

      const result = {
        objects: allObjects,
        counts,
        threats,
      };

      console.log("Setting detection result:", result);
      setDetectionResult(result);
    } catch (err) {
      setError("Object detection failed");
      console.error("Detection error:", err);
    }
  }, [videoRef, isDetecting]);

  const startDetection = useCallback(() => {
    if (isDetecting) return;

    console.log("Starting object detection...");
    setIsDetecting(true);
    setError(null);

    // Start detection every 1 second for more frequent updates
    detectionIntervalRef.current = setInterval(detectObjects, 1000);

    // Initial detection
    detectObjects();
  }, [isDetecting, detectObjects]);

  const stopDetection = useCallback(() => {
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
    };
  }, []);

  return {
    detectionResult,
    isDetecting,
    error,
    startDetection,
    stopDetection,
  };
}
