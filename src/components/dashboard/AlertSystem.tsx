import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandButton } from "@/components/ui/command-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, Eye, Clock, CheckCircle, X } from "lucide-react";

interface Alert {
  id: string;
  type: "intrusion" | "weapon" | "vehicle" | "sos" | "system";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: "active" | "acknowledged" | "resolved";
  source: string;
}

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT001",
      type: "weapon",
      severity: "critical",
      title: "Weapon Detection",
      description: "AI detected rifle-type weapon in Sector B-12",
      location: "Border Fence Grid 25.05°N 75.05°E",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: "active",
      source: "Camera Feed #7"
    },
    {
      id: "ALT002",
      type: "sos",
      severity: "critical",
      title: "SOS Signal",
      description: "Emergency beacon activated by Charlie-3",
      location: "Patrol Route Delta-9",
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      status: "acknowledged",
      source: "Field Device"
    },
    {
      id: "ALT003",
      type: "intrusion",
      severity: "high",
      title: "Perimeter Breach",
      description: "Unauthorized person detected crossing border line",
      location: "Sector A-8 Northern Perimeter",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      status: "resolved",
      source: "Motion Sensor Array"
    },
    {
      id: "ALT004",
      type: "vehicle",
      severity: "medium",
      title: "Vehicle Approach",
      description: "Unidentified vehicle approaching checkpoint",
      location: "Main Access Road Charlie",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      status: "active",
      source: "Camera Feed #3"
    }
  ]);

  const [filter, setFilter] = useState<string>("all");

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: "acknowledged" } : alert
    ));
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: "resolved" } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "alert-critical";
      case "high": return "alert-warning";
      case "medium": return "alert-info";
      default: return "status-standby";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weapon": return AlertTriangle;
      case "sos": return Shield;
      case "intrusion": return Eye;
      case "vehicle": return Eye;
      default: return AlertTriangle;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return { variant: "destructive" as const, text: "ACTIVE" };
      case "acknowledged": return { variant: "secondary" as const, text: "ACK" };
      case "resolved": return { variant: "outline" as const, text: "RESOLVED" };
      default: return { variant: "outline" as const, text: status.toUpperCase() };
    }
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(alert => alert.status === filter);

  const activeAlertsCount = alerts.filter(alert => alert.status === "active").length;

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
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Filter Controls */}
        <div className="flex gap-2 mb-4">
          <CommandButton
            variant={filter === "all" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Alerts
          </CommandButton>
          <CommandButton
            variant={filter === "active" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active ({activeAlertsCount})
          </CommandButton>
          <CommandButton
            variant={filter === "acknowledged" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("acknowledged")}
          >
            Acknowledged
          </CommandButton>
          <CommandButton
            variant={filter === "resolved" ? "tactical" : "ghost"}
            size="sm"
            onClick={() => setFilter("resolved")}
          >
            Resolved
          </CommandButton>
        </div>

        {/* Alerts List */}
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
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
                      : "from-accent to-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-full bg-${getSeverityColor(alert.severity)}/20`}>
                        <IconComponent className={`w-4 h-4 text-${getSeverityColor(alert.severity)}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-foreground">{alert.title}</h4>
                          <Badge variant={statusBadge.variant} className="text-xs">
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
                          <span>Source: {alert.source}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {alert.status === "active" && (
                        <CommandButton
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="h-8 w-8 p-0"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </CommandButton>
                      )}
                      
                      {alert.status === "acknowledged" && (
                        <CommandButton
                          variant="ghost"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Shield className="w-4 h-4" />
                        </CommandButton>
                      )}
                      
                      <CommandButton
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </CommandButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts in this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}