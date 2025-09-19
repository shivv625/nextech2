import { useState } from "react";
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
} from "lucide-react";

interface TroopPosition {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  status: "active" | "standby" | "sos" | "offline";
  unit: string;
}

interface ThreatMarker {
  id: string;
  position: { lat: number; lng: number };
  type: "intrusion" | "weapon" | "vehicle" | "unknown";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
}

export function TacticalMap() {
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(50);

  // Mock data
  const troops: TroopPosition[] = [
    {
      id: "T001",
      name: "Alpha-1",
      position: { lat: 25.0, lng: 75.0 },
      status: "active",
      unit: "1st Battalion",
    },
    {
      id: "T002",
      name: "Bravo-2",
      position: { lat: 25.2, lng: 75.1 },
      status: "standby",
      unit: "2nd Battalion",
    },
    {
      id: "T003",
      name: "Charlie-3",
      position: { lat: 24.9, lng: 74.9 },
      status: "sos",
      unit: "3rd Battalion",
    },
  ];

  const threats: ThreatMarker[] = [
    {
      id: "TH001",
      position: { lat: 25.05, lng: 75.05 },
      type: "intrusion",
      severity: "high",
      timestamp: new Date(),
    },
    {
      id: "TH002",
      position: { lat: 24.95, lng: 74.95 },
      type: "weapon",
      severity: "critical",
      timestamp: new Date(),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-status-active";
      case "standby":
        return "bg-status-standby";
      case "sos":
        return "bg-status-critical animate-pulse";
      default:
        return "bg-status-offline";
    }
  };

  const getThreatColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-alert-critical";
      case "high":
        return "bg-alert-warning";
      case "medium":
        return "bg-alert-info";
      default:
        return "bg-status-standby";
    }
  };

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
              {troops.length} Troops
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

        {/* Map Display */}
        <div className="relative aspect-[4/3] bg-grid-secondary border border-grid-primary rounded-lg overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Border Line */}
          <div className="absolute inset-0">
            <svg className="w-full h-full">
              <line
                x1="10%"
                y1="20%"
                x2="90%"
                y2="80%"
                stroke="hsl(var(--alert-warning))"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              <text
                x="50%"
                y="15%"
                textAnchor="middle"
                className="fill-alert-warning text-xs"
              >
                BORDER LINE
              </text>
            </svg>
          </div>

          {/* Troop Positions */}
          {(selectedLayer === "all" || selectedLayer === "troops") &&
            troops.map((troop) => (
              <div
                key={troop.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${(troop.position.lng - 74.5) * 200}%`,
                  top: `${(25.5 - troop.position.lat) * 200}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full ${getStatusColor(
                    troop.status
                  )} border-2 border-white`}
                ></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap">
                    <div className="font-medium">{troop.name}</div>
                    <div className="text-muted-foreground">{troop.unit}</div>
                    <div className="text-muted-foreground">
                      {troop.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Threat Markers */}
          {(selectedLayer === "all" || selectedLayer === "threats") &&
            threats.map((threat) => (
              <div
                key={threat.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${(threat.position.lng - 74.5) * 200}%`,
                  top: `${(25.5 - threat.position.lat) * 200}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`w-6 h-6 ${getThreatColor(
                    threat.severity
                  )} rounded-full border-2 border-white flex items-center justify-center`}
                >
                  <AlertTriangle className="w-3 h-3 text-white" />
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap">
                    <div className="font-medium">
                      {threat.type.toUpperCase()}
                    </div>
                    <div className="text-muted-foreground">
                      Severity: {threat.severity}
                    </div>
                    <div className="text-muted-foreground">
                      {threat.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Coordinates overlay */}
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">
            Zoom: {zoomLevel}% | Grid: 25°N 75°E
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-status-active rounded-full"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-status-standby rounded-full"></div>
              <span>Standby</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-status-critical rounded-full animate-pulse"></div>
              <span>SOS</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
