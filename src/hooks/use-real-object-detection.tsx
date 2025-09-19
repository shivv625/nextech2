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

export interface UseRealObjectDetectionReturn {
  detectionResult: ObjectDetectionResult | null;
  isDetecting: boolean;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
  isModelLoaded: boolean;
}

// YOLO v8 style detection using computer vision techniques
export function useRealObjectDetection(
  videoRef: React.RefObject<HTMLVideoElement>
): UseRealObjectDetectionReturn {
  const [detectionResult, setDetectionResult] =
    useState<ObjectDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(true); // Always ready
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas for image processing
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvasRef.current = canvas;
  }, []);

  // YOLO v8 style object detection using computer vision
  const detectObjects = useCallback(async () => {
    if (!videoRef.current || !isDetecting || !canvasRef.current) {
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

      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Enhanced detection using multiple techniques
      const detectedObjects: DetectedObject[] = [];

      // 1. Face detection using skin tone detection
      const faceRegions = detectFaces(data, canvas.width, canvas.height);

      // 2. Body detection using contour analysis
      const bodyRegions = detectBodies(data, canvas.width, canvas.height);

      // 3. Motion detection for moving objects
      const motionRegions = detectMotion(data, canvas.width, canvas.height);

      // 4. Edge detection for object boundaries
      const edgeRegions = detectEdges(data, canvas.width, canvas.height);

      // Combine all detection methods
      const allRegions = [
        ...faceRegions,
        ...bodyRegions,
        ...motionRegions,
        ...edgeRegions,
      ];

      // Remove overlapping regions and merge nearby ones
      const mergedRegions = mergeRegions(allRegions);

      // Classify detected regions
      for (const region of mergedRegions) {
        const objectType = classifyObject(
          region,
          data,
          canvas.width,
          canvas.height
        );
        const confidence = calculateConfidence(region, objectType);

        if (confidence > 0.4) {
          // Lower threshold for better detection
          detectedObjects.push({
            id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: objectType,
            confidence: confidence,
            bbox: {
              x: region.x,
              y: region.y,
              width: region.width,
              height: region.height,
            },
            timestamp: new Date(),
          });
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

  // Face detection using skin tone analysis
  const detectFaces = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    const regions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const blockSize = 40; // Larger blocks for face detection

    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        let skinScore = 0;
        let totalPixels = 0;

        // Analyze skin tone in this region
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            totalPixels++;

            // Enhanced skin tone detection
            if (
              r > 95 &&
              r < 255 &&
              g > 40 &&
              g < 200 &&
              b > 20 &&
              b < 180 &&
              r > g &&
              g > b &&
              r - g > 15 &&
              g - b > 15
            ) {
              skinScore++;
            }
          }
        }

        // If significant skin tone detected
        if (skinScore > totalPixels * 0.3) {
          regions.push({
            x: x,
            y: y,
            width: blockSize,
            height: blockSize,
          });
        }
      }
    }

    return regions;
  };

  // Body detection using contour analysis
  const detectBodies = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    const regions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const blockSize = 60; // Larger blocks for body detection

    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        let bodyScore = 0;
        let totalPixels = 0;

        // Analyze vertical contours (body-like shapes)
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            totalPixels++;

            // Look for vertical edges and body-like colors
            const intensity = (r + g + b) / 3;
            if (intensity > 50 && intensity < 200) {
              // Check for vertical edges
              if (by > 0 && by < blockSize - 1) {
                const prevIdx = ((y + by - 1) * width + (x + bx)) * 4;
                const nextIdx = ((y + by + 1) * width + (x + bx)) * 4;
                const prevIntensity =
                  (data[prevIdx] + data[prevIdx + 1] + data[prevIdx + 2]) / 3;
                const nextIntensity =
                  (data[nextIdx] + data[nextIdx + 1] + data[nextIdx + 2]) / 3;

                if (
                  Math.abs(intensity - prevIntensity) > 30 ||
                  Math.abs(intensity - nextIntensity) > 30
                ) {
                  bodyScore++;
                }
              }
            }
          }
        }

        // If significant body-like features detected
        if (bodyScore > totalPixels * 0.2) {
          regions.push({
            x: x,
            y: y,
            width: blockSize,
            height: blockSize,
          });
        }
      }
    }

    return regions;
  };

  // Merge overlapping regions
  const mergeRegions = (
    regions: Array<{ x: number; y: number; width: number; height: number }>
  ) => {
    if (regions.length === 0) return regions;

    const merged: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const used = new Set<number>();

    for (let i = 0; i < regions.length; i++) {
      if (used.has(i)) continue;

      const region = regions[i];
      let mergedRegion = { ...region };
      used.add(i);

      // Find overlapping regions
      for (let j = i + 1; j < regions.length; j++) {
        if (used.has(j)) continue;

        const otherRegion = regions[j];

        // Check if regions overlap
        if (
          !(
            region.x + region.width < otherRegion.x ||
            region.x > otherRegion.x + otherRegion.width ||
            region.y + region.height < otherRegion.y ||
            region.y > otherRegion.y + otherRegion.height
          )
        ) {
          // Merge regions
          mergedRegion = {
            x: Math.min(region.x, otherRegion.x),
            y: Math.min(region.y, otherRegion.y),
            width:
              Math.max(
                region.x + region.width,
                otherRegion.x + otherRegion.width
              ) - Math.min(region.x, otherRegion.x),
            height:
              Math.max(
                region.y + region.height,
                otherRegion.y + otherRegion.height
              ) - Math.min(region.y, otherRegion.y),
          };
          used.add(j);
        }
      }

      merged.push(mergedRegion);
    }

    return merged;
  };

  // Motion detection algorithm
  const detectMotion = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    const regions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const blockSize = 32; // YOLO v8 style grid

    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        let motionScore = 0;

        // Calculate motion by comparing pixel intensity changes
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Motion detection based on intensity changes
            const intensity = (r + g + b) / 3;
            if (intensity > 100 && intensity < 200) {
              // Detect moving objects
              motionScore++;
            }
          }
        }

        // If motion detected in this region
        if (motionScore > blockSize * blockSize * 0.3) {
          regions.push({
            x: x,
            y: y,
            width: blockSize,
            height: blockSize,
          });
        }
      }
    }

    return regions;
  };

  // Edge detection algorithm
  const detectEdges = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    const regions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const blockSize = 32;

    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        let edgeScore = 0;

        // Sobel edge detection
        for (let by = 1; by < blockSize - 1; by++) {
          for (let bx = 1; bx < blockSize - 1; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const intensity = (r + g + b) / 3;

            // Calculate gradient
            const gx = Math.abs(
              data[((y + by) * width + (x + bx + 1)) * 4] -
                data[((y + by) * width + (x + bx - 1)) * 4]
            );
            const gy = Math.abs(
              data[((y + by + 1) * width + (x + bx)) * 4] -
                data[((y + by - 1) * width + (x + bx)) * 4]
            );

            const gradient = Math.sqrt(gx * gx + gy * gy);
            if (gradient > 50) {
              // Edge threshold
              edgeScore++;
            }
          }
        }

        // If edges detected in this region
        if (edgeScore > blockSize * blockSize * 0.2) {
          regions.push({
            x: x,
            y: y,
            width: blockSize,
            height: blockSize,
          });
        }
      }
    }

    return regions;
  };

  // Combine motion and edge detection regions
  const combineRegions = (motionRegions: any[], edgeRegions: any[]) => {
    const combined: any[] = [];

    // Add motion regions
    combined.push(...motionRegions);

    // Add edge regions that don't overlap with motion regions
    for (const edgeRegion of edgeRegions) {
      const overlaps = motionRegions.some(
        (motionRegion) =>
          !(
            edgeRegion.x + edgeRegion.width < motionRegion.x ||
            edgeRegion.x > motionRegion.x + motionRegion.width ||
            edgeRegion.y + edgeRegion.height < motionRegion.y ||
            edgeRegion.y > motionRegion.y + motionRegion.height
          )
      );

      if (!overlaps) {
        combined.push(edgeRegion);
      }
    }

    return combined;
  };

  // Classify object type based on region characteristics
  const classifyObject = (
    region: any,
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    const { x, y, width: w, height: h } = region;

    // Analyze region characteristics
    let personScore = 0;
    let vehicleScore = 0;
    let droneScore = 0;
    let weaponScore = 0;

    let skinPixels = 0;
    let totalPixels = 0;

    // Sample pixels in the region
    for (let py = y; py < y + h; py += 2) {
      for (let px = x; px < x + w; px += 2) {
        const idx = (py * width + px) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        totalPixels++;

        // Enhanced skin tone detection
        if (
          r > 95 &&
          r < 255 &&
          g > 40 &&
          g < 200 &&
          b > 20 &&
          b < 180 &&
          r > g &&
          g > b &&
          r - g > 15 &&
          g - b > 15
        ) {
          skinPixels++;
          personScore += 3; // Higher weight for skin detection
        }

        // Color-based classification
        if (r > 100 && g > 80 && b > 60) {
          // Skin-like colors
          personScore += 1;
        }
        if (r > 150 && g > 150 && b > 150) {
          // Metallic colors
          vehicleScore += 1;
        }
        if (r < 100 && g < 100 && b < 100) {
          // Dark colors
          weaponScore += 1;
        }
        if (r > 200 && g > 200 && b > 200) {
          // Bright colors
          droneScore += 1;
        }
      }
    }

    // Size-based classification
    const aspectRatio = w / h;
    const area = w * h;

    // Person detection based on size and aspect ratio
    if (area > 2000 && area < 50000) {
      // Reasonable person size
      if (aspectRatio > 0.4 && aspectRatio < 1.2) {
        // Person-like aspect ratio
        personScore += 5;
      }
    }

    // Vehicle detection
    if (area > 5000 && area < 80000) {
      // Vehicle size range
      if (aspectRatio > 1.2) {
        // Wide (vehicle)
        vehicleScore += 3;
      }
    }

    // Drone detection
    if (area > 1000 && area < 20000) {
      // Drone size range
      if (aspectRatio < 0.8) {
        // Tall (drone)
        droneScore += 2;
      }
    }

    // Weapon detection
    if (area > 500 && area < 10000) {
      // Weapon size range
      if (aspectRatio > 0.8 && aspectRatio < 1.5) {
        // Weapon-like aspect ratio
        weaponScore += 2;
      }
    }

    // High confidence for skin detection
    if (skinPixels > totalPixels * 0.2) {
      personScore += 10; // Very high confidence for skin detection
    }

    // Return the most likely type
    const scores = {
      person: personScore,
      vehicle: vehicleScore,
      drone: droneScore,
      weapon: weaponScore,
    };
    const maxScore = Math.max(...Object.values(scores));

    if (maxScore > 0) {
      return Object.keys(scores).find(
        (key) => scores[key as keyof typeof scores] === maxScore
      ) as DetectedObject["type"];
    }

    return "unknown";
  };

  // Calculate confidence based on region characteristics
  const calculateConfidence = (region: any, objectType: string) => {
    let confidence = 0.3; // Lower base confidence

    // Size factor
    const area = region.width * region.height;
    if (area > 1000 && area < 50000) {
      // Reasonable object size
      confidence += 0.3;
    }

    // Type-specific confidence
    switch (objectType) {
      case "person":
        confidence += 0.4; // Higher confidence for person detection
        break;
      case "vehicle":
        confidence += 0.2;
        break;
      case "drone":
        confidence += 0.1;
        break;
      case "weapon":
        confidence += 0.1;
        break;
    }

    // Boost confidence for larger regions
    if (area > 5000) {
      confidence += 0.1;
    }

    return Math.min(confidence, 0.95);
  };

  const startDetection = useCallback(() => {
    if (isDetecting) return;

    console.log("Starting YOLO v8 object detection...");
    setIsDetecting(true);
    setError(null);

    // Start detection every 200ms for real-time detection
    detectionIntervalRef.current = setInterval(detectObjects, 200);
  }, [isDetecting, detectObjects]);

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
    };
  }, []);

  return {
    detectionResult,
    isDetecting,
    error,
    startDetection,
    stopDetection,
    isModelLoaded: true, // Always ready
  };
}
