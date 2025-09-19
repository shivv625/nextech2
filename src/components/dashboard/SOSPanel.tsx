import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandButton } from "@/components/ui/command-button";
import { Badge } from "@/components/ui/badge";
import { Shield, Phone, MapPin, Clock, AlertTriangle, Mic, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SOSPanel() {
  const [sosActive, setSosActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const activateSOS = () => {
    setSosActive(true);
    setIsRecording(true);
    
    toast({
      title: "🚨 SOS ACTIVATED",
      description: "Emergency signal transmitted to command center. Help is on the way.",
      variant: "destructive",
    });

    // Auto-deactivate after 60 seconds for demo
    setTimeout(() => {
      setIsRecording(false);
    }, 60000);
  };

  const deactivateSOS = () => {
    setSosActive(false);
    setIsRecording(false);
    
    toast({
      title: "SOS Deactivated",
      description: "Emergency signal cancelled.",
    });
  };

  return (
    <Card className="bg-card border-grid-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Emergency Response System
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* SOS Button */}
          <div className="text-center">
            {!sosActive ? (
              <CommandButton
                variant="sos"
                size="sos"
                onClick={activateSOS}
                className="w-full"
              >
                <AlertTriangle className="w-6 h-6" />
                EMERGENCY SOS
              </CommandButton>
            ) : (
              <div className="space-y-3">
                <CommandButton
                  variant="sos"
                  size="sos"
                  onClick={deactivateSOS}
                  className="w-full animate-pulse"
                >
                  <Shield className="w-6 h-6" />
                  SOS ACTIVE - TAP TO CANCEL
                </CommandButton>
                
                <div className="flex justify-center gap-2">
                  <Badge variant="destructive" className="animate-pulse">
                    <Clock className="w-3 h-3 mr-1" />
                    SIGNAL ACTIVE
                  </Badge>
                  {isRecording && (
                    <Badge variant="secondary">
                      <Video className="w-3 h-3 mr-1" />
                      RECORDING
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Actions */}
          <div className="grid grid-cols-2 gap-3">
            <CommandButton variant="tactical" className="flex-col h-16">
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-xs">Emergency Call</span>
            </CommandButton>
            
            <CommandButton variant="tactical" className="flex-col h-16">
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-xs">Share Location</span>
            </CommandButton>
            
            <CommandButton variant="tactical" className="flex-col h-16">
              <Mic className="w-5 h-5 mb-1" />
              <span className="text-xs">Voice Message</span>
            </CommandButton>
            
            <CommandButton variant="tactical" className="flex-col h-16">
              <Video className="w-5 h-5 mb-1" />
              <span className="text-xs">Live Stream</span>
            </CommandButton>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">EMERGENCY CONTACTS</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                <div>
                  <p className="text-xs font-medium">Command Center</p>
                  <p className="text-xs text-muted-foreground">24/7 Operations</p>
                </div>
                <CommandButton variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </CommandButton>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                <div>
                  <p className="text-xs font-medium">Medical Support</p>
                  <p className="text-xs text-muted-foreground">Emergency Medical</p>
                </div>
                <CommandButton variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </CommandButton>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                <div>
                  <p className="text-xs font-medium">Quick Reaction Force</p>
                  <p className="text-xs text-muted-foreground">Tactical Response</p>
                </div>
                <CommandButton variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </CommandButton>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="p-3 bg-accent rounded-lg">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPS Status:</span>
                <Badge variant="outline" className="text-xs">ACTIVE</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signal Strength:</span>
                <Badge variant="outline" className="text-xs">Strong</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Check-in:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}