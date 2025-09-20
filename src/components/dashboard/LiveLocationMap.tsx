import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Shield,
  Radio,
  Clock,
  Target,
  Layers,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { config, isMapEnabled } from "@/config/environment";

interface ArmyPersonnel {
  id: string;
  name: string;
  rank: string;
  status: "online" | "offline" | "sos" | "mission";
  location: {
    lat: number;
    lng: number;
  };
  lastUpdate: Date;
  battery: number;
  signal: number;
}

interface LiveLocationMapProps {
  className?: string;
}

// AIIMS Bhubaneswar, Odisha, India coordinates
const AIIMS_BHUBANESWAR = {
  lat: 20.2961,
  lng: 85.8245,
  name: "NMIET",
  address: "Sijua, Patrapada, Bhubaneswar, Odisha 751019, India",
};

// Mock army personnel data around AIIMS Bhubaneswar - in real app, this would come from API
const mockArmyPersonnel: ArmyPersonnel[] = [
  {
    id: "1",
    name: "Sgt. John Smith",
    rank: "Sergeant",
    status: "online",
    location: { lat: 20.2961, lng: 85.8245 },
    lastUpdate: new Date(),
    battery: 85,
    signal: 4,
  },
  {
    id: "2",
    name: "Cpl. Mike Johnson",
    rank: "Corporal",
    status: "mission",
    location: { lat: 20.2965, lng: 85.825 },
    lastUpdate: new Date(),
    battery: 92,
    signal: 5,
  },
  {
    id: "3",
    name: "Pvt. Sarah Wilson",
    rank: "Private",
    status: "sos",
    location: { lat: 20.2958, lng: 85.8255 },
    lastUpdate: new Date(),
    battery: 23,
    signal: 2,
  },
  {
    id: "4",
    name: "Lt. David Brown",
    rank: "Lieutenant",
    status: "online",
    location: { lat: 20.2963, lng: 85.824 },
    lastUpdate: new Date(),
    battery: 78,
    signal: 4,
  },
];

// Client-side only map component with OpenStreetMap
function MapComponent({ armyPersonnel }: { armyPersonnel: ArmyPersonnel[] }) {
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load OpenStreetMap when client-side
  useEffect(() => {
    if (!isClient || !mapRef.current || mapLoaded) return;

    const loadMap = async () => {
      try {
        // Dynamically import Leaflet only on client side
        const L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create map centered on AIIMS Bhubaneswar
        const map = L.map(mapRef.current!).setView(
          [AIIMS_BHUBANESWAR.lat, AIIMS_BHUBANESWAR.lng],
          16
        );

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Add AIIMS Bhubaneswar marker
        const aiimsIcon = L.divIcon({
          html: `
            <div style="
              background: #dc2626;
              color: white;
              border: 2px solid white;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              🏥
            </div>
          `,
          className: "custom-aiims-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([AIIMS_BHUBANESWAR.lat, AIIMS_BHUBANESWAR.lng], {
          icon: aiimsIcon,
        }).addTo(map).bindPopup(`
            <div style="color: #000; font-family: Arial, sans-serif; min-width: 200px;">
              <div style="background: #dc2626; color: white; padding: 8px; margin: -8px -8px 8px -8px; border-radius: 4px 4px 0 0;">
                <strong>🏥 ${AIIMS_BHUBANESWAR.name}</strong>
              </div>
              <div style="padding: 4px 0;">
                <div><strong>Address:</strong> ${
                  AIIMS_BHUBANESWAR.address
                }</div>
                <div><strong>Coordinates:</strong> ${AIIMS_BHUBANESWAR.lat.toFixed(
                  4
                )}, ${AIIMS_BHUBANESWAR.lng.toFixed(4)}</div>
                <div><strong>Status:</strong> Medical Facility</div>
              </div>
            </div>
          `);

        // Fit bounds to show all markers
        if (armyPersonnel.length > 0) {
          const bounds = L.latLngBounds(
            armyPersonnel.map((soldier) => [
              soldier.location.lat,
              soldier.location.lng,
            ])
          );
          bounds.extend([AIIMS_BHUBANESWAR.lat, AIIMS_BHUBANESWAR.lng]);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (err) {
        console.error("Error loading map:", err);
      }
    };

    loadMap();
  }, [isClient, mapLoaded, armyPersonnel]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    // Add army personnel markers
    armyPersonnel.forEach((person) => {
      const colors = {
        online: "#10b981",
        sos: "#ef4444",
        mission: "#3b82f6",
        offline: "#6b7280",
      };

      const getMarkerIcon = (status: string) => {
        switch (status) {
          case "sos":
            return "🚨";
          case "mission":
            return "🎯";
          case "online":
            return "🛡️";
          case "offline":
            return "⚫";
          default:
            return "❓";
        }
      };

      const svgIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${
            colors[person.status as keyof typeof colors] || colors.offline
          }" stroke="white" stroke-width="2"/>
          <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${getMarkerIcon(
            person.status
          )}</text>
        </svg>
      `;

      const customIcon = L.divIcon({
        html: svgIcon,
        className: "custom-soldier-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([person.location.lat, person.location.lng], {
        icon: customIcon,
      }).addTo(mapInstanceRef.current).bindPopup(`
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-sm">${person.rank} ${person.name}</h3>
              <span class="text-xs px-2 py-1 rounded ${
                person.status === "online"
                  ? "bg-green-100 text-green-800"
                  : person.status === "sos"
                  ? "bg-red-100 text-red-800"
                  : person.status === "mission"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }">${person.status.toUpperCase()}</span>
            </div>
            <div class="space-y-1 text-xs text-gray-600">
              <div>Location: ${person.location.lat.toFixed(
                4
              )}, ${person.location.lng.toFixed(4)}</div>
              <div>Battery: ${person.battery}%</div>
              <div>Signal: ${person.signal}/5</div>
              <div>Updated: ${person.lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        `);

      markersRef.current.push(marker);

      // Add SOS circle for critical soldiers
      if (person.status === "sos") {
        const circle = L.circle([person.location.lat, person.location.lng], {
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.1,
          radius: 100,
        }).addTo(mapInstanceRef.current);
        markersRef.current.push(circle);
      }
    });
  }, [armyPersonnel, mapLoaded]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800">
        <div className="text-center text-gray-300">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapRef}
        className="w-full h-full border border-gray-700 rounded-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      >
        {/* Map controls overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-30">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white text-black"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Location info overlay */}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded z-30">
          AIIMS Bhubaneswar, Odisha | Personnel: {armyPersonnel.length} | Last
          Update: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default function LiveLocationMap({ className }: LiveLocationMapProps) {
  const [armyPersonnel, setArmyPersonnel] =
    useState<ArmyPersonnel[]>(mockArmyPersonnel);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setArmyPersonnel((prev) =>
        prev.map((person) => ({
          ...person,
          location: {
            lat: person.location.lat + (Math.random() - 0.5) * 0.0001,
            lng: person.location.lng + (Math.random() - 0.5) * 0.0001,
          },
          lastUpdate: new Date(),
          battery: Math.max(0, person.battery - Math.random() * 0.5),
          signal: Math.max(
            1,
            Math.min(5, person.signal + (Math.random() - 0.5) * 0.5)
          ),
        }))
      );
    }, config.location.updateInterval); // Use configured update interval

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setArmyPersonnel((prev) =>
        prev.map((person) => ({
          ...person,
          lastUpdate: new Date(),
        }))
      );
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusCounts = () => {
    const counts = armyPersonnel.reduce((acc, person) => {
      acc[person.status] = (acc[person.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Live Army Locations - AIIMS Bhubaneswar
            </CardTitle>
            <CardDescription>
              Real-time tracking of army personnel around AIIMS Bhubaneswar,
              Odisha
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 bg-green-900/20 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-green-400">Online</p>
              <p className="text-lg font-bold text-white">
                {statusCounts.online || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-red-900/20 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-red-400">SOS</p>
              <p className="text-lg font-bold text-white">
                {statusCounts.sos || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-900/20 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-blue-400">Mission</p>
              <p className="text-lg font-bold text-white">
                {statusCounts.mission || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-900/20 rounded-lg">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-400">Offline</p>
              <p className="text-lg font-bold text-white">
                {statusCounts.offline || 0}
              </p>
            </div>
          </div>
        </div>

        {/* OpenStreetMap */}
        <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
          <MapComponent armyPersonnel={armyPersonnel} />
        </div>

        {/* Personnel List */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Personnel Details
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {armyPersonnel.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-2 bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      person.status === "online"
                        ? "bg-green-500"
                        : person.status === "sos"
                        ? "bg-red-500 animate-pulse"
                        : person.status === "mission"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {person.rank} {person.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {person.location.lat.toFixed(4)},{" "}
                      {person.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {person.battery}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {person.signal}/5
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {person.lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
