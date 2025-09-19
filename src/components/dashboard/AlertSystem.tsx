import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandButton } from "@/components/ui/command-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  X,
  Users,
  Car,
  Plane,
  Target,
} from "lucide-react";
import { useAlerts } from "@/hooks/use-alerts";

export function AlertSystem() {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert,
    getActiveAlertsCount,
    getObjectCounts,
  } = useAlerts();

  const [filter, setFilter] = useState<string>("all");
  const objectCounts = getObjectCounts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "alert-critical";
      case "high":
        return "alert-warning";
      case "medium":
        return "alert-info";
      default:
        return "status-standby";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weapon":
        return Target;
      case "sos":
        return Shield;
      case "intrusion":
        return Users;
      case "vehicle":
        return Car;
      case "drone":
        return Plane;
      default:
        return AlertTriangle;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { variant: "destructive" as const, text: "ACTIVE" };
      case "acknowledged":
        return { variant: "secondary" as const, text: "ACK" };
      case "resolved":
        return { variant: "outline" as const, text: "RESOLVED" };
      default:
        return { variant: "outline" as const, text: status.toUpperCase() };
    }
  };

  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((alert) => alert.status === filter);

  const activeAlertsCount = getActiveAlertsCount();

  return (
    <Card className="bg-card border-grid-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alert Command Center
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeAlertsCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {activeAlertsCount} ACTIVE
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {alerts.length} Total
            </Badge>
          </div>
        </div>

        {/* Object Detection Counts */}
        <div className="mt-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-red-500" />
            <span className="text-red-400 font-medium">
              {objectCounts.persons}
            </span>
            <span className="text-muted-foreground">Persons</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-3 h-3 text-blue-500" />
            <span className="text-blue-400 font-medium">
              {objectCounts.vehicles}
            </span>
            <span className="text-muted-foreground">Vehicles</span>
          </div>
          <div className="flex items-center gap-1">
            <Plane className="w-3 h-3 text-orange-500" />
            <span className="text-orange-400 font-medium">
              {objectCounts.drones}
            </span>
            <span className="text-muted-foreground">Drones</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-red-600" />
            <span className="text-red-500 font-medium">
              {objectCounts.weapons}
            </span>
            <span className="text-muted-foreground">Weapons</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Filter Controls */}
        <div className="flex gap-2 mb-4">
          <CommandButton
            variant={filter === "all" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({alerts.length})
          </CommandButton>
          <CommandButton
            variant={filter === "active" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active ({alerts.filter((a) => a.status === "active").length})
          </CommandButton>
          <CommandButton
            variant={filter === "acknowledged" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("acknowledged")}
          >
            Acknowledged (
            {alerts.filter((a) => a.status === "acknowledged").length})
          </CommandButton>
        </div>

        {/* Alerts List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No alerts found</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const IconComponent = getTypeIcon(alert.type);
                const statusBadge = getStatusBadge(alert.status);

                return (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border border-grid-primary bg-gradient-to-r ${
                      alert.severity === "critical"
                        ? "from-alert-critical/10 to-transparent border-alert-critical/50"
                        : alert.severity === "high"
                        ? "from-alert-warning/10 to-transparent border-alert-warning/50"
                        : "from-alert-info/10 to-transparent border-alert-info/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`p-2 rounded-full bg-${getSeverityColor(
                            alert.severity
                          )}/20`}
                        >
                          <IconComponent
                            className={`w-4 h-4 text-${getSeverityColor(
                              alert.severity
                            )}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground">
                              {alert.title}
                            </h4>
                            <Badge
                              variant={statusBadge.variant}
                              className="text-xs"
                            >
                              {statusBadge.text}
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground mb-1">
                            {alert.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                            <span>{alert.location}</span>
                            <span>{alert.source}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        {alert.status === "active" && (
                          <CommandButton
                            variant="ghost"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ack
                          </CommandButton>
                        )}

                        {alert.status === "acknowledged" && (
                          <CommandButton
                            variant="ghost"
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                            className="text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </CommandButton>
                        )}

                        <CommandButton
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </CommandButton>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
