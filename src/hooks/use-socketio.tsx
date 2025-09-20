import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface DetectionEvent {
  camera_id: string;
  detections: Array<{
    id: string;
    type: "person" | "vehicle" | "drone" | "weapon";
    confidence: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  counts: {
    persons: number;
    vehicles: number;
    drones: number;
    weapons: number;
  };
  threats: Array<any>;
  timestamp: number;
}

export interface ThreatAlert {
  camera_id: string;
  threats: Array<any>;
  location: string;
  timestamp: number;
}

export interface UseSocketIOReturn {
  socket: Socket | null;
  isConnected: boolean;
  detectionEvents: DetectionEvent[];
  threatAlerts: ThreatAlert[];
  startDetection: (cameraId: string) => void;
  stopDetection: (cameraId: string) => void;
}

const SOCKET_SERVER_URL = "http://localhost:5000";

export function useSocketIO(): UseSocketIOReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [detectionEvents, setDetectionEvents] = useState<DetectionEvent[]>([]);
  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error);
      setIsConnected(false);
    });

    // Server status events
    socket.on("status", (data) => {
      console.log("📡 Server status:", data);
    });

    // Real-time detection events
    socket.on("detection_update", (data: DetectionEvent) => {
      console.log("🎯 Detection update:", data);
      setDetectionEvents((prev) => {
        // Keep only the latest 100 events to prevent memory issues
        const newEvents = [data, ...prev].slice(0, 100);
        return newEvents;
      });
    });

    // Threat alert events
    socket.on("threat_alert", (data: ThreatAlert) => {
      console.log("🚨 Threat alert:", data);
      setThreatAlerts((prev) => {
        // Keep only the latest 50 alerts
        const newAlerts = [data, ...prev].slice(0, 50);
        return newAlerts;
      });
    });

    // Detection status events
    socket.on("detection_status", (data) => {
      console.log("📹 Detection status:", data);
    });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up Socket.IO connection");
      socket.disconnect();
    };
  }, []);

  const startDetection = (cameraId: string) => {
    if (socketRef.current?.connected) {
      console.log(`🎬 Starting detection for camera ${cameraId}`);
      socketRef.current.emit("start_detection", { camera_id: cameraId });
    }
  };

  const stopDetection = (cameraId: string) => {
    if (socketRef.current?.connected) {
      console.log(`⏹️ Stopping detection for camera ${cameraId}`);
      socketRef.current.emit("stop_detection", { camera_id: cameraId });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    detectionEvents,
    threatAlerts,
    startDetection,
    stopDetection,
  };
}
