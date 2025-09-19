import { useState, useEffect, useRef, useCallback } from "react";

export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export interface UseCameraReturn {
  devices: CameraDevice[];
  currentDeviceId: string | null;
  stream: MediaStream | null;
  error: string | null;
  isStreaming: boolean;
  switchCamera: (deviceId: string) => void;
  startStream: () => Promise<void>;
  stopStream: () => void;
  refreshDevices: () => Promise<void>;
}

export function useCamera(): UseCameraReturn {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const refreshDevices = useCallback(async () => {
    try {
      setError(null);

      // Request permission first
      await navigator.mediaDevices.getUserMedia({ video: true });

      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
        }));

      setDevices(videoDevices);

      // Set the first camera as default if none is selected
      if (videoDevices.length > 0 && !currentDeviceId) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      setError(
        "Failed to access camera devices. Please ensure camera permissions are granted."
      );
      console.error("Error accessing camera devices:", err);
    }
  }, [currentDeviceId]);

  const startStream = useCallback(async () => {
    if (!currentDeviceId) {
      setError("No camera device selected");
      return;
    }

    try {
      setError(null);
      setIsStreaming(true);

      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Start new stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: currentDeviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      streamRef.current = newStream;
      setStream(newStream);
    } catch (err) {
      setError(
        "Failed to start camera stream. Please check camera permissions."
      );
      setIsStreaming(false);
      console.error("Error starting camera stream:", err);
    }
  }, [currentDeviceId]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsStreaming(false);
  }, []);

  const switchCamera = useCallback((deviceId: string) => {
    setCurrentDeviceId(deviceId);
  }, []);

  // Load devices on mount
  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  // Auto-start stream when device changes
  useEffect(() => {
    if (currentDeviceId && devices.length > 0) {
      startStream();
    }
  }, [currentDeviceId, devices, startStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    devices,
    currentDeviceId,
    stream,
    error,
    isStreaming,
    switchCamera,
    startStream,
    stopStream,
    refreshDevices,
  };
}
