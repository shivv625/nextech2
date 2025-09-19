import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Radio,
  MapPin,
  AlertTriangle,
  Send,
  Users,
  MessageCircle,
  Phone,
  Navigation,
  Zap,
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: "text" | "sos" | "location";
}

interface TeamMember {
  id: string;
  name: string;
  status: "online" | "offline" | "sos";
  location: { lat: number; lng: number };
  lastSeen: Date;
}

export default function ArmyDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sgt. John Smith",
      status: "online",
      location: { lat: 20.2961, lng: 85.8245 },
      lastSeen: new Date(),
    },
    {
      id: "2",
      name: "Cpl. Mike Johnson",
      status: "online",
      location: { lat: 20.2965, lng: 85.825 },
      lastSeen: new Date(),
    },
    {
      id: "3",
      name: "Pvt. Sarah Wilson",
      status: "sos",
      location: { lat: 20.2958, lng: 85.8255 },
      lastSeen: new Date(),
    },
  ]);
  const [sosActive, setSosActive] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const authStatus = localStorage.getItem("authenticated");
    const userRole = localStorage.getItem("userRole");
    if (!authStatus || userRole !== "army") {
      navigate("/login");
    }
  }, [navigate]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "You",
        message: newMessage,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const sendSOS = () => {
    setSosActive(true);
    const sosMessage: Message = {
      id: Date.now().toString(),
      sender: "SOS Alert",
      message: "EMERGENCY SOS ALERT SENT TO COMMAND CENTER!",
      timestamp: new Date(),
      type: "sos",
    };
    setMessages((prev) => [...prev, sosMessage]);

    // Simulate SOS response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: "Command Center",
        message: "SOS received! Backup units dispatched to your location.",
        timestamp: new Date(),
        type: "sos",
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const sendLocation = () => {
    if (currentLocation) {
      const locationMessage: Message = {
        id: Date.now().toString(),
        sender: "Location Update",
        message: `Location shared: ${currentLocation.lat.toFixed(
          4
        )}, ${currentLocation.lng.toFixed(4)}`,
        timestamp: new Date(),
        type: "location",
      };
      setMessages((prev) => [...prev, locationMessage]);

      // In a real app, this would send to command center via API
      console.log("Location shared with command center:", currentLocation);

      // Simulate command center acknowledgment
      setTimeout(() => {
        const ackMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "Command Center",
          message: "Location received and updated on tactical map.",
          timestamp: new Date(),
          type: "location",
        };
        setMessages((prev) => [...prev, ackMessage]);
      }, 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "sos":
        return "bg-red-500 animate-pulse";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "sos":
        return "SOS Alert";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Army Personnel Dashboard
                </h1>
                <p className="text-red-200">
                  Tactical Communication & Emergency Response
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-400 border-green-400"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected
              </Badge>
              <Button variant="outline" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                {currentLocation ? "Location Active" : "Location Off"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("authenticated");
                  localStorage.removeItem("userRole");
                  navigate("/login");
                }}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Emergency Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-red-900/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={sendSOS}
                  disabled={sosActive}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {sosActive ? "SOS SENT" : "SEND SOS"}
                </Button>

                <Button
                  onClick={sendLocation}
                  variant="outline"
                  className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Share Location
                </Button>

                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-sm text-gray-300">
                    Location Sharing
                  </span>
                  <Button
                    size="sm"
                    variant={locationSharing ? "default" : "outline"}
                    onClick={() => setLocationSharing(!locationSharing)}
                  >
                    {locationSharing ? "ON" : "OFF"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Status */}
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            member.status
                          )}`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getStatusText(member.status)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {member.lastSeen.toLocaleTimeString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communication Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-600/30 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Team Communication
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time communication with your team and command center
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.type === "sos"
                            ? "bg-red-900/30 border border-red-500/50"
                            : message.type === "location"
                            ? "bg-blue-900/30 border border-blue-500/50"
                            : "bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">
                            {message.sender}
                          </span>
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.type === "sos" && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              SOS
                            </Badge>
                          )}
                          {message.type === "location" && (
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-400 text-blue-400"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              Location
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-200 text-sm">
                          {message.message}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">
                  Connected to Command Center
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {currentLocation
                    ? `Location: ${currentLocation.lat.toFixed(
                        4
                      )}, ${currentLocation.lng.toFixed(4)}`
                    : "Location not available"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
