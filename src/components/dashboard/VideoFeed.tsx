import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useCamera } from "@/hooks/use-camera";

interface VideoFeedProps {
  feedId: string;
  title: string;
  location: string;
  status: "live" | "offline" | "recording";
  threatLevel: "low" | "medium" | "high" | "critical";
  detectedObjects?: string[];
  cameraIndex?: number; // Index to determine which camera to use (0, 1, 2)
}

export function VideoFeed({
  feedId,
  title,
  location,
  status,
  threatLevel,
  detectedObjects = [],
  cameraIndex = 0,
}: VideoFeedProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCameraControls, setShowCameraControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
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
