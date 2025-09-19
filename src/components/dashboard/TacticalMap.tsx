import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandButton } from "@/components/ui/command-button";
import {
  MapPin,
  Users,
  AlertTriangle,
  Target,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Navigation,
  Battery,
  Clock,
} from "lucide-react";
import { useSoldierLocations } from "@/hooks/use-soldier-locations";

// Client-side only map component with OpenStreetMap
function LiveMap({
  soldiers,
  threats,
  selectedLayer,
  isLoading,
  error,
  refreshLocations,
}: {
  soldiers: any[];
  threats: any[];
  selectedLayer: string;
  isLoading: boolean;
  error: string | null;
  refreshLocations: () => void;
}) {
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

        // Create map
        const map = L.map(mapRef.current!).setView([25.0, 75.0], 10);

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Fit bounds to show all soldiers
        if (soldiers.length > 0) {
          const bounds = L.latLngBounds(
            soldiers.map((soldier) => [
              soldier.position.lat,
              soldier.position.lng,
            ])
          );
          if (threats.length > 0) {
            threats.forEach((threat) =>
              bounds.extend([threat.position.lat, threat.position.lng])
            );
          }
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (err) {
        console.error("Error loading map:", err);
      }
    };

    loadMap();
  }, [isClient, mapLoaded, soldiers, threats]);

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

    // Add soldier markers
    if (selectedLayer === "all" || selectedLayer === "troops") {
      soldiers.forEach((soldier) => {
        const colors = {
          active: "#10b981",
          standby: "#f59e0b",
          sos: "#ef4444",
          offline: "#6b7280",
        };

        const svgIcon = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="${
              colors[soldier.status as keyof typeof colors] || colors.offline
            }" stroke="white" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <text x="12" y="8" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${
              soldier.batteryLevel
            }%</text>
          </svg>
        `;

        const customIcon = L.divIcon({
          html: svgIcon,
          className: "custom-soldier-icon",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([soldier.position.lat, soldier.position.lng], {
          icon: customIcon,
        }).addTo(mapInstanceRef.current).bindPopup(`
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-sm">${soldier.name}</h3>
                <span class="text-xs px-2 py-1 rounded ${
                  soldier.status === "active"
                    ? "bg-green-100 text-green-800"
                    : soldier.status === "sos"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }">${soldier.status.toUpperCase()}</span>
              </div>
              <div class="space-y-1 text-xs text-gray-600">
                <div>Unit: ${soldier.unit}</div>
                <div>Battery: ${soldier.batteryLevel}%</div>
                <div>Updated: ${soldier.lastUpdate.toLocaleTimeString()}</div>
                ${
                  soldier.heading !== undefined
                    ? `<div>Heading: ${soldier.heading}°</div>`
                    : ""
                }
                ${
                  soldier.speed !== undefined
                    ? `<div>Speed: ${soldier.speed} km/h</div>`
                    : ""
                }
              </div>
            </div>
          `);

        markersRef.current.push(marker);

        // Add SOS circle for critical soldiers
        if (soldier.status === "sos") {
          const circle = L.circle(
            [soldier.position.lat, soldier.position.lng],
            {
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.1,
              radius: 500,
            }
          ).addTo(mapInstanceRef.current);
          markersRef.current.push(circle);
        }
      });
    }

    // Add threat markers
    if (selectedLayer === "all" || selectedLayer === "threats") {
      threats.forEach((threat) => {
        const colors = {
          critical: "#dc2626",
          high: "#ea580c",
          medium: "#d97706",
          low: "#65a30d",
        };

        const svgIcon = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                  fill="${
                    colors[threat.severity as keyof typeof colors] || colors.low
                  }" 
                  stroke="white" 
                  stroke-width="1"/>
          </svg>
        `;

        const customIcon = L.divIcon({
          html: svgIcon,
          className: "custom-threat-icon",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([threat.position.lat, threat.position.lng], {
          icon: customIcon,
        }).addTo(mapInstanceRef.current).bindPopup(`
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-sm">${threat.type.toUpperCase()}</h3>
                <span class="text-xs px-2 py-1 rounded ${
                  threat.severity === "critical"
                    ? "bg-red-100 text-red-800"
                    : threat.severity === "high"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-yellow-100 text-yellow-800"
                }">${threat.severity.toUpperCase()}</span>
              </div>
              <div class="space-y-1 text-xs text-gray-600">
                <div>Time: ${threat.timestamp.toLocaleTimeString()}</div>
                ${threat.description ? `<div>${threat.description}</div>` : ""}
              </div>
            </div>
          `);

        markersRef.current.push(marker);
      });
    }
  }, [soldiers, threats, selectedLayer, mapLoaded]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-grid-secondary">
        <div className="text-center text-muted-foreground">
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
        className="w-full h-full border border-grid-primary rounded-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      >
        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-50">
            <div className="text-center text-red-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Map Error</p>
              <p className="text-xs">{error}</p>
              <CommandButton
                variant="ghost"
                size="sm"
                className="mt-2 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                onClick={refreshLocations}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </CommandButton>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="text-center text-white">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm">Updating locations...</p>
            </div>
          </div>
        )}

        {/* Map controls overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-30">
          <CommandButton
            variant="ghost"
            size="sm"
            className="bg-white/90 hover:bg-white text-black"
            onClick={refreshLocations}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </CommandButton>
        </div>

        {/* Coordinates overlay */}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded z-30">
          Soldiers: {soldiers.length} | Threats: {threats.length} | Last Update:{" "}
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export function TacticalMap() {
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(50);
  const { soldiers, threats, isLoading, error, refreshLocations } =
    useSoldierLocations();

  return (
    <Card className="bg-card border-grid-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Target className="w-4 h-4" />
            Tactical Situation Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {soldiers.length} Soldiers
            </Badge>
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {threats.length} Threats
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Map Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <CommandButton
              variant={selectedLayer === "all" ? "tactical" : "ghost"}
              size="sm"
              onClick={() => setSelectedLayer("all")}
            >
              <Layers className="w-4 h-4" />
              All
            </CommandButton>
            <CommandButton
              variant={selectedLayer === "troops" ? "tactical" : "ghost"}
              size="sm"
              onClick={() => setSelectedLayer("troops")}
            >
              <Users className="w-4 h-4" />
              Troops
            </CommandButton>
            <CommandButton
              variant={selectedLayer === "threats" ? "tactical" : "ghost"}
              size="sm"
              onClick={() => setSelectedLayer("threats")}
            >
              <AlertTriangle className="w-4 h-4" />
              Threats
            </CommandButton>
          </div>

          <div className="flex gap-2">
            <CommandButton
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(Math.min(100, zoomLevel + 10))}
            >
              <ZoomIn className="w-4 h-4" />
            </CommandButton>
            <CommandButton
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))}
            >
              <ZoomOut className="w-4 h-4" />
            </CommandButton>
          </div>
        </div>

        {/* Live Map Display */}
        <div className="relative aspect-[4/3] bg-grid-secondary border border-grid-primary rounded-lg overflow-hidden">
          <LiveMap
            soldiers={soldiers}
            threats={threats}
            selectedLayer={selectedLayer}
            isLoading={isLoading}
            error={error}
            refreshLocations={refreshLocations}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Soldiers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Standby</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>SOS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Threats</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Live Updates: {isLoading ? "Updating..." : "Active"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
