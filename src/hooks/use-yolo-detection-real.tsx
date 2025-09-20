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
  timestamp: number;
  original_class: string;
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
  image_with_detections?: string;
}

export interface UseYoloDetectionReturn {
  detectionResult: ObjectDetectionResult | null;
  isDetecting: boolean;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
  isModelLoaded: boolean;
}

const API_BASE_URL = "http://localhost:5000";

export function useYoloDetectionReal(
  videoRef: React.RefObject<HTMLVideoElement>,
  cameraId: string = "camera-1"
): UseYoloDetectionReturn {
  const [detectionResult, setDetectionResult] =
    useState<ObjectDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas for image processing
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvasRef.current = canvas;
  }, []);

  // Check if backend is available
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        setIsModelLoaded(data.model_loaded);
        if (!data.model_loaded) {
          setError("YOLO model not loaded on backend");
        }
      } catch (err) {
        console.error("Backend health check failed:", err);
        setError("Backend server not available");
        setIsModelLoaded(false);
      }
    };

    checkBackendHealth();
  }, []);

  // Convert video frame to base64
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      return canvas.toDataURL("image/jpeg", 0.8);
    } catch (err) {
      console.error("Error capturing frame:", err);
      return null;
    }
  }, [videoRef]);

  // Perform YOLO detection
  const detectObjects = useCallback(async () => {
    if (!videoRef.current || !isDetecting || !isModelLoaded) return;

    try {
      const imageData = captureFrame();
      if (!imageData) return;

      const response = await fetch(
        `${API_BASE_URL}/detect_with_visualization`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageData,
            confidence: 0.4, // Lowered threshold for better detection
            camera_id: cameraId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const result: ObjectDetectionResult = {
          objects: data.detections || [],
          counts: data.counts || {
            persons: 0,
            vehicles: 0,
            drones: 0,
            weapons: 0,
          },
          threats: data.threats || [],
          image_with_detections: data.image_with_detections,
        };

        setDetectionResult(result);
        setError(null);

        // Log detection results for debugging
        if (result.objects.length > 0) {
          console.log(`${cameraId} detected:`, {
            total: result.objects.length,
            persons: result.counts.persons,
            vehicles: result.counts.vehicles,
            drones: result.counts.drones,
            weapons: result.counts.weapons,
            threats: result.threats.length,
          });
        }
      } else {
        throw new Error(data.error || "Detection failed");
      }
    } catch (err) {
      console.error(`YOLO detection error for ${cameraId}:`, err);
      setError(err instanceof Error ? err.message : "Detection failed");
    }
  }, [videoRef, isDetecting, isModelLoaded, cameraId, captureFrame]);

  const startDetection = useCallback(() => {
    if (isDetecting || !isModelLoaded) return;

    console.log(`Starting YOLO detection for camera ${cameraId}...`);
    setIsDetecting(true);
    setError(null);

    // Start detection every 500ms for real-time detection
    detectionIntervalRef.current = setInterval(detectObjects, 500);
  }, [isDetecting, isModelLoaded, detectObjects, cameraId]);

  const stopDetection = useCallback(() => {
    console.log(`Stopping YOLO detection for camera ${cameraId}...`);
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, [cameraId]);

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
    isModelLoaded,
  };
}
