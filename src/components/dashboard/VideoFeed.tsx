import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandButton } from "@/components/ui/command-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  Maximize2,
  Settings,
  AlertTriangle,
  Camera,
  CameraOff,
  RefreshCw,
  Eye,
  Target,
  Zap,
  Plane,
} from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useYoloDetection } from "@/hooks/use-yolo-detection";
import { useAlerts } from "@/hooks/use-alerts";
import { config, isFeatureEnabled } from "@/config/environment";

interface VideoFeedProps {
  feedId: string;
  title: string;
  location: string;
  status: "live" | "offline" | "recording";
  threatLevel: "low" | "medium" | "high" | "critical";
  detectedObjects?: string[];
  cameraIndex?: number; // Index to determine which camera to use (0, 1, 2)
  enableObjectDetection?: boolean; // Enable AI object detection
  enableNightVision?: boolean; // Enable night vision effect
}

export function VideoFeed({
  feedId,
  title,
  location,
  status,
  threatLevel,
  detectedObjects = [],
  cameraIndex = 0,
  enableObjectDetection = false,
  enableNightVision = false,
}: VideoFeedProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCameraControls, setShowCameraControls] = useState(false);
  const [nightVisionEnabled, setNightVisionEnabled] =
    useState(enableNightVision);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    devices,
    currentDeviceId,
    stream,
    error,
    isStreaming,
    switchCamera,
    startStream,
    stopStream,
    refreshDevices,
  } = useCamera();

  const {
    detectionResult,
    isDetecting,
    error: detectionError,
    startDetection,
    stopDetection,
    isModelLoaded,
  } = useYoloDetection(videoRef);

  const { addAlert } = useAlerts();

  // Set up video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Auto-select camera based on cameraIndex
  useEffect(() => {
    if (devices.length > 0 && cameraIndex < devices.length) {
      switchCamera(devices[cameraIndex].deviceId);
    }
  }, [devices, cameraIndex, switchCamera]);

  // Start/stop object detection based on enableObjectDetection
  useEffect(() => {
    if (enableObjectDetection && isStreaming && isModelLoaded) {
      console.log("Starting YOLO v8 object detection...");
      startDetection();
    } else {
      console.log("Stopping object detection...");
      stopDetection();
    }
  }, [
    enableObjectDetection,
    isStreaming,
    isModelLoaded,
    startDetection,
    stopDetection,
  ]);

  // Debug detection result
  useEffect(() => {
    if (detectionResult) {
      console.log("Detection result:", detectionResult);
    }
  }, [detectionResult]);

  // Auto-generate SOS alerts for threats
  useEffect(() => {
    if (detectionResult?.threats && detectionResult.threats.length > 0) {
      detectionResult.threats.forEach((threat) => {
        const alertType =
          threat.type === "person"
            ? "intrusion"
            : threat.type === "drone"
            ? "drone"
            : threat.type === "weapon"
            ? "weapon"
            : "system";

        addAlert({
          type: alertType,
          severity:
            threat.type === "weapon"
              ? "critical"
              : threat.type === "person"
              ? "high"
              : "medium",
          title: `${
            threat.type.charAt(0).toUpperCase() + threat.type.slice(1)
          } Detected`,
          description: `AI detected ${threat.type} with ${Math.round(
            threat.confidence * 100
          )}% confidence`,
          location: location,
          status: "active",
          source: `Camera Feed ${feedId}`,
          cameraId: feedId,
          objectCount: 1,
        });
      });
    }
  }, [detectionResult?.threats, addAlert, location, feedId]);

  // Night vision effect
  const applyNightVision = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !nightVisionEnabled) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply night vision effect (green tint, enhanced contrast)
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

      // Apply green tint
      data[i] = gray * 0.2; // Red
      data[i + 1] = gray * 0.8; // Green (enhanced)
      data[i + 2] = gray * 0.1; // Blue

      // Enhance contrast
      data[i + 3] = Math.min(255, data[i + 3] * 1.2);
    }

    ctx.putImageData(imageData, 0, 0);
  }, [nightVisionEnabled]);

  // Apply night vision effect continuously
  useEffect(() => {
    if (!nightVisionEnabled || !isStreaming) return;

    const interval = setInterval(applyNightVision, 100);
    return () => clearInterval(interval);
  }, [nightVisionEnabled, isStreaming, applyNightVision]);

  const getThreatBadgeVariant = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "status-active";
      case "recording":
        return "status-standby";
      default:
        return "status-offline";
    }
  };

  return (
    <Card className="bg-card border-grid-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-foreground">
              {title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`border-${getStatusColor(
                status
              )} text-${getStatusColor(status)}`}
            >
              {status.toUpperCase()}
            </Badge>
            {threatLevel !== "low" && (
              <Badge variant={getThreatBadgeVariant(threatLevel)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {threatLevel.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-video bg-grid-secondary border border-grid-primary overflow-hidden">
          {/* Live camera feed */}
          {isStreaming && stream ? (
            <div className="relative w-full h-full">
              {/* Regular video feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  nightVisionEnabled ? "hidden" : "block"
                }`}
              />

              {/* Night vision canvas overlay */}
              {nightVisionEnabled && (
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                  style={{
                    filter: "contrast(1.5) brightness(0.8) hue-rotate(90deg)",
                    background: "#000",
                  }}
                />
              )}

              {/* Object detection overlays */}
              {enableObjectDetection && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Model loading indicator */}
                  {!isModelLoaded && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading YOLO v8 Model...
                    </div>
                  )}

                  {/* Detection starting indicator */}
                  {isModelLoaded && !detectionResult && isDetecting && (
                    <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      YOLO v8 Detection Starting...
                    </div>
                  )}

                  {detectionResult?.objects?.map((obj) => {
                    const getObjectColor = (type: string) => {
                      switch (type) {
                        case "person":
                          return "#ef4444";
                        case "vehicle":
                          return "#3b82f6";
                        case "drone":
                          return "#f59e0b";
                        case "weapon":
                          return "#dc2626";
                        default:
                          return "#6b7280";
                      }
                    };

                    const getObjectIcon = (type: string) => {
                      switch (type) {
                        case "person":
                          return "👤";
                        case "vehicle":
                          return "🚗";
                        case "drone":
                          return "✈️";
                        case "weapon":
                          return "🔫";
                        default:
                          return "❓";
                      }
                    };

                    return (
                      <div
                        key={obj.id}
                        className="absolute"
                        style={{
                          left: `${(obj.bbox.x / 640) * 100}%`,
                          top: `${(obj.bbox.y / 480) * 100}%`,
                          width: `${(obj.bbox.width / 640) * 100}%`,
                          height: `${(obj.bbox.height / 480) * 100}%`,
                        }}
                      >
                        {/* Detection box */}
                        <div
                          className="absolute inset-0 border-2 rounded-lg animate-pulse"
                          style={{
                            borderColor: getObjectColor(obj.type),
                            boxShadow: `0 0 10px ${getObjectColor(obj.type)}50`,
                          }}
                        />

                        {/* Detection label */}
                        <div
                          className="absolute -top-8 left-0 bg-black/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 font-bold"
                          style={{
                            border: `1px solid ${getObjectColor(obj.type)}`,
                            boxShadow: `0 0 5px ${getObjectColor(obj.type)}50`,
                          }}
                        >
                          <span className="text-lg">
                            {getObjectIcon(obj.type)}
                          </span>
                          <span className="uppercase">{obj.type}</span>
                          <span className="text-yellow-400">
                            ({Math.round(obj.confidence * 100)}%)
                          </span>
                        </div>

                        {/* Corner indicators */}
                        <div
                          className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 rounded-tl-lg"
                          style={{ borderColor: getObjectColor(obj.type) }}
                        />
                        <div
                          className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 rounded-tr-lg"
                          style={{ borderColor: getObjectColor(obj.type) }}
                        />
                        <div
                          className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 rounded-bl-lg"
                          style={{ borderColor: getObjectColor(obj.type) }}
                        />
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 rounded-br-lg"
                          style={{ borderColor: getObjectColor(obj.type) }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Fallback when no camera stream */
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/20">
              <div className="w-full h-full bg-grid-pattern opacity-10"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900/20">
              <div className="text-center text-red-400">
                <CameraOff className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm font-medium">Camera Error</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {!isStreaming && !error && devices.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p className="text-xs">Loading cameras...</p>
              </div>
            </div>
          )}

          {/* No camera available */}
          {!isStreaming && !error && devices.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm font-medium">No Camera Available</p>
                <p className="text-xs">Feed {feedId}</p>
              </div>
            </div>
          )}

          {/* Detection overlays */}
          {detectedObjects.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {detectedObjects.map((object, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {object}
                </Badge>
              ))}
            </div>
          )}

          {/* Object detection status */}
          {enableObjectDetection && (
            <div className="absolute top-2 left-2 flex items-center gap-2">
              {!isModelLoaded ? (
                <Badge variant="outline" className="text-xs bg-blue-600">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Loading YOLO v8...
                </Badge>
              ) : (
                <>
                  <Badge
                    variant={isDetecting ? "default" : "secondary"}
                    className="text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    YOLO v8 {isDetecting ? "ON" : "OFF"}
                  </Badge>
                  {detectionResult && (
                    <Badge variant="outline" className="text-xs">
                      {detectionResult.counts.persons}P{" "}
                      {detectionResult.counts.vehicles}V{" "}
                      {detectionResult.counts.drones}D
                    </Badge>
                  )}
                  {!detectionResult && isDetecting && (
                    <Badge variant="outline" className="text-xs bg-yellow-600">
                      Detecting...
                    </Badge>
                  )}
                </>
              )}
            </div>
          )}

          {/* Night vision indicator */}
          {nightVisionEnabled && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                NIGHT VISION
              </Badge>
            </div>
          )}

          {/* Threat level indicator */}
          {threatLevel !== "low" && (
            <div className="absolute top-2 right-2">
              <div
                className={`w-3 h-3 rounded-full bg-alert-${
                  threatLevel === "critical"
                    ? "critical"
                    : threatLevel === "high"
                    ? "warning"
                    : "info"
                } animate-pulse`}
              ></div>
            </div>
          )}

          {/* Control overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="flex gap-2">
              <CommandButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </CommandButton>

              <CommandButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70"
                onClick={() => setShowCameraControls(!showCameraControls)}
              >
                <Camera className="w-4 h-4" />
              </CommandButton>

              {/* Night vision toggle */}
              {enableNightVision && (
                <CommandButton
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${
                    nightVisionEnabled
                      ? "bg-green-600/50 hover:bg-green-600/70"
                      : "bg-black/50 hover:bg-black/70"
                  }`}
                  onClick={() => setNightVisionEnabled(!nightVisionEnabled)}
                >
                  <Zap className="w-4 h-4" />
                </CommandButton>
              )}

              <CommandButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70"
              >
                <Maximize2 className="w-4 h-4" />
              </CommandButton>

              <CommandButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70"
              >
                <Settings className="w-4 h-4" />
              </CommandButton>
            </div>

            <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Camera selection dropdown */}
          {showCameraControls && devices.length > 0 && (
            <div className="absolute top-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">
                  Camera Selection
                </span>
                <CommandButton
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-auto text-white hover:bg-white/20"
                  onClick={refreshDevices}
                >
                  <RefreshCw className="w-3 h-3" />
                </CommandButton>
              </div>
              <Select
                value={currentDeviceId || ""}
                onValueChange={(value) => switchCamera(value)}
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 mt-2">
                <CommandButton
                  variant="ghost"
                  size="sm"
                  className="flex-1 bg-green-600/20 hover:bg-green-600/40 text-green-400"
                  onClick={startStream}
                  disabled={isStreaming}
                >
                  <Camera className="w-3 h-3 mr-1" />
                  Start
                </CommandButton>
                <CommandButton
                  variant="ghost"
                  size="sm"
                  className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                  onClick={stopStream}
                  disabled={!isStreaming}
                >
                  <CameraOff className="w-3 h-3 mr-1" />
                  Stop
                </CommandButton>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
