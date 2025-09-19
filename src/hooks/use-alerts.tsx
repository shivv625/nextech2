import { useState, useCallback } from "react";

export interface Alert {
  id: string;
  type: "intrusion" | "weapon" | "vehicle" | "sos" | "system" | "drone";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: "active" | "acknowledged" | "resolved";
  source: string;
  cameraId?: string;
  objectCount?: number;
}

export interface UseAlertsReturn {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id" | "timestamp">) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  getActiveAlertsCount: () => number;
  getObjectCounts: () => {
    persons: number;
    vehicles: number;
    drones: number;
    weapons: number;
  };
}

export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT001",
      type: "weapon",
      severity: "critical",
      title: "Weapon Detection",
      description: "AI detected rifle-type weapon in Sector B-12",
      location: "Border Fence Grid 25.05°N 75.05°E",
      timestamp: new Date(Date.now() - 300000),
      status: "active",
      source: "Camera Feed #7",
    },
    {
      id: "ALT002",
      type: "sos",
      severity: "critical",
      title: "SOS Signal",
      description: "Emergency beacon activated by Charlie-3",
      location: "Patrol Route Delta-9",
      timestamp: new Date(Date.now() - 180000),
      status: "acknowledged",
      source: "Field Device",
    },
    {
      id: "ALT003",
      type: "intrusion",
      severity: "high",
      title: "Perimeter Breach",
      description: "Unauthorized person detected crossing border line",
      location: "Sector A-8 Northern Perimeter",
      timestamp: new Date(Date.now() - 600000),
      status: "resolved",
      source: "Motion Sensor Array",
    },
    {
      id: "ALT004",
      type: "vehicle",
      severity: "medium",
      title: "Vehicle Approach",
      description: "Unidentified vehicle approaching checkpoint",
      location: "Main Access Road Charlie",
      timestamp: new Date(Date.now() - 120000),
      status: "active",
      source: "Camera Feed #3",
    },
  ]);

  const addAlert = useCallback((alertData: Omit<Alert, "id" | "timestamp">) => {
    const newAlert: Alert = {
      ...alertData,
      id: `ALT${Date.now().toString().slice(-6)}`,
      timestamp: new Date(),
    };

    setAlerts((prev) => [newAlert, ...prev]);

    // Auto-acknowledge after 30 seconds if not critical
    if (alertData.severity !== "critical") {
      setTimeout(() => {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === newAlert.id && alert.status === "active"
              ? { ...alert, status: "acknowledged" }
              : alert
          )
        );
      }, 30000);
    }
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "acknowledged" } : alert
      )
    );
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" } : alert
      )
    );
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const getActiveAlertsCount = useCallback(() => {
    return alerts.filter((alert) => alert.status === "active").length;
  }, [alerts]);

  const getObjectCounts = useCallback(() => {
    const activeAlerts = alerts.filter((alert) => alert.status === "active");

    return {
      persons: activeAlerts.filter((alert) => alert.type === "intrusion")
        .length,
      vehicles: activeAlerts.filter((alert) => alert.type === "vehicle").length,
      drones: activeAlerts.filter((alert) => alert.type === "drone").length,
      weapons: activeAlerts.filter((alert) => alert.type === "weapon").length,
    };
  }, [alerts]);

  return {
    alerts,
    addAlert,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert,
    getActiveAlertsCount,
    getObjectCounts,
  };
}
