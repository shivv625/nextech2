import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoFeed } from "@/components/dashboard/VideoFeed";
import { TacticalMap } from "@/components/dashboard/TacticalMap";
import { AlertSystem } from "@/components/dashboard/AlertSystem";
import { SOSPanel } from "@/components/dashboard/SOSPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Target,
  AlertTriangle,
  Users,
  Activity,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Mission Status Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-alert-critical/10 to-transparent border border-alert-critical/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              RAKSH KAVACH Command Center
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-Powered Defense & Border Management System
            </p>
          </div>
          <div className="text-right">
            <Badge variant="destructive" className="mb-2 animate-pulse">
              ALERT CONDITION: BRAVO
            </Badge>
            <div className="text-sm text-muted-foreground">
              Sector: Northern Border | Grid: 25°N 75°E
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-grid-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-alert-critical">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-alert-critical" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-grid-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Troops Online</p>
                <p className="text-2xl font-bold text-status-active">24</p>
              </div>
              <Users className="w-8 h-8 text-status-active" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-grid-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Feeds</p>
                <p className="text-2xl font-bold text-alert-info">8</p>
              </div>
              <Eye className="w-8 h-8 text-alert-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-grid-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-2xl font-bold text-status-active">94.7%</p>
              </div>
              <Activity className="w-8 h-8 text-status-active" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video Feeds */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <VideoFeed
              feedId="CAM-007"
              title="Sector B-12 Perimeter"
              location="Border Fence North"
              status="live"
              threatLevel="critical"
              detectedObjects={["Person", "Rifle"]}
              cameraIndex={0}
            />
            <VideoFeed
              feedId="CAM-003"
              title="Main Checkpoint"
              location="Access Road Charlie"
              status="live"
              threatLevel="medium"
              detectedObjects={["Vehicle", "Person"]}
              cameraIndex={1}
            />
            <VideoFeed
              feedId="CAM-012"
              title="Patrol Route Delta"
              location="Eastern Perimeter"
              status="recording"
              threatLevel="low"
              detectedObjects={[]}
              cameraIndex={2}
            />
            <VideoFeed
              feedId="CAM-018"
              title="Command Outpost"
              location="Forward Base Alpha"
              status="live"
              threatLevel="low"
              detectedObjects={["Vehicle"]}
              cameraIndex={0}
            />
          </div>

          {/* Tactical Map */}
          <TacticalMap />
        </div>

        {/* Right Column - Alerts and SOS */}
        <div className="space-y-6">
          <AlertSystem />
          <SOSPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
