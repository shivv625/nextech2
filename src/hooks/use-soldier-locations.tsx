import { useState, useEffect, useCallback } from "react";

export interface SoldierLocation {
  id: string;
  name: string;
  unit: string;
  position: { lat: number; lng: number };
  status: "active" | "standby" | "sos" | "offline";
  lastUpdate: Date;
  batteryLevel: number;
  heading?: number;
  speed?: number;
}

export interface ThreatLocation {
  id: string;
  position: { lat: number; lng: number };
  type: "intrusion" | "weapon" | "vehicle" | "unknown";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  description?: string;
}

export interface UseSoldierLocationsReturn {
  soldiers: SoldierLocation[];
  threats: ThreatLocation[];
  isLoading: boolean;
  error: string | null;
  refreshLocations: () => void;
  updateSoldierLocation: (
    id: string,
    position: { lat: number; lng: number }
  ) => void;
}

// Mock data for demonstration - in real implementation, this would come from your backend
const MOCK_SOLDIERS: SoldierLocation[] = [
  {
    id: "T001",
    name: "Alpha-1",
    unit: "1st Battalion",
    position: { lat: 25.0, lng: 75.0 },
    status: "active",
    lastUpdate: new Date(),
    batteryLevel: 85,
    heading: 45,
    speed: 2.5,
  },
  {
    id: "T002",
    name: "Bravo-2",
    unit: "2nd Battalion",
    position: { lat: 25.2, lng: 75.1 },
    status: "standby",
    lastUpdate: new Date(),
    batteryLevel: 92,
    heading: 180,
    speed: 0,
  },
  {
    id: "T003",
    name: "Charlie-3",
    unit: "3rd Battalion",
    position: { lat: 24.9, lng: 74.9 },
    status: "sos",
    lastUpdate: new Date(),
    batteryLevel: 15,
    heading: 270,
    speed: 0,
  },
  {
    id: "T004",
    name: "Delta-4",
    unit: "1st Battalion",
    position: { lat: 25.1, lng: 75.2 },
    status: "active",
    lastUpdate: new Date(),
    batteryLevel: 78,
    heading: 90,
    speed: 1.8,
  },
  {
    id: "T005",
    name: "Echo-5",
    unit: "2nd Battalion",
    position: { lat: 24.8, lng: 75.05 },
    status: "offline",
    lastUpdate: new Date(Date.now() - 300000), // 5 minutes ago
    batteryLevel: 0,
    heading: 0,
    speed: 0,
  },
];

const MOCK_THREATS: ThreatLocation[] = [
  {
    id: "TH001",
    position: { lat: 25.05, lng: 75.05 },
    type: "intrusion",
    severity: "high",
    timestamp: new Date(),
    description: "Unauthorized personnel detected",
  },
  {
    id: "TH002",
    position: { lat: 24.95, lng: 74.95 },
    type: "weapon",
    severity: "critical",
    timestamp: new Date(),
    description: "Weapon detected in restricted area",
  },
  {
    id: "TH003",
    position: { lat: 25.15, lng: 75.15 },
    type: "vehicle",
    severity: "medium",
    timestamp: new Date(),
    description: "Suspicious vehicle movement",
  },
];

export function useSoldierLocations(): UseSoldierLocationsReturn {
  const [soldiers, setSoldiers] = useState<SoldierLocation[]>(MOCK_SOLDIERS);
  const [threats, setThreats] = useState<ThreatLocation[]>(MOCK_THREATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSoldiers((prevSoldiers) =>
        prevSoldiers.map((soldier) => {
          if (soldier.status === "offline") return soldier;

          // Simulate small random movement for active soldiers
          if (soldier.status === "active" && Math.random() > 0.7) {
            const latOffset = (Math.random() - 0.5) * 0.001;
            const lngOffset = (Math.random() - 0.5) * 0.001;

            return {
              ...soldier,
              position: {
                lat: soldier.position.lat + latOffset,
                lng: soldier.position.lng + lngOffset,
              },
              lastUpdate: new Date(),
              batteryLevel: Math.max(
                0,
                soldier.batteryLevel - Math.random() * 0.5
              ),
            };
          }

          return {
            ...soldier,
            lastUpdate: new Date(),
            batteryLevel: Math.max(
              0,
              soldier.batteryLevel - Math.random() * 0.1
            ),
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, fetch from your backend API
      // const response = await fetch('/api/soldiers/locations');
      // const data = await response.json();
      // setSoldiers(data.soldiers);
      // setThreats(data.threats);

      setSoldiers(MOCK_SOLDIERS);
      setThreats(MOCK_THREATS);
    } catch (err) {
      setError("Failed to refresh soldier locations");
      console.error("Error refreshing locations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSoldierLocation = useCallback(
    (id: string, position: { lat: number; lng: number }) => {
      setSoldiers((prevSoldiers) =>
        prevSoldiers.map((soldier) =>
          soldier.id === id
            ? { ...soldier, position, lastUpdate: new Date() }
            : soldier
        )
      );
    },
    []
  );

  return {
    soldiers,
    threats,
    isLoading,
    error,
    refreshLocations,
    updateSoldierLocation,
  };
}
