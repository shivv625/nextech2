import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Users, MapPin, Radio, AlertTriangle } from "lucide-react";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<"army" | "command" | null>(null);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: "army" | "command") => {
    setSelectedRole(role);
    setCredentials({ username: "", password: "" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Set authentication status
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', selectedRole || '');
      
      if (selectedRole === "army") {
        navigate("/army-dashboard");
      } else if (selectedRole === "command") {
        navigate("/");
      }
    }, 1000);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setCredentials({ username: "", password: "" });
  };

  if (selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              {selectedRole === "army" ? (
                <Shield className="w-8 h-8 text-white" />
              ) : (
                <Users className="w-8 h-8 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {selectedRole === "army" ? "Army Personnel Login" : "Command Center Login"}
            </CardTitle>
            <CardDescription>
              {selectedRole === "army" 
                ? "Access your tactical dashboard and communication tools"
                : "Access the command center admin panel"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={selectedRole === "army" ? "Enter your ID" : "Enter admin username"}
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Rakshak AI Watch
          </h1>
          <p className="text-xl text-blue-200">
            Advanced Tactical Surveillance & Communication System
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Army Personnel Login */}
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30"
            onClick={() => handleRoleSelect("army")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-400">
                Army Personnel
              </CardTitle>
              <CardDescription className="text-red-200">
                Access tactical dashboard, SOS alerts, and communication tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span>SOS Emergency Alerts</span>
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <Radio className="w-5 h-5" />
                  <span>Team Communication</span>
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <MapPin className="w-5 h-5" />
                  <span>Live Location Sharing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Command Center Login */}
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30"
            onClick={() => handleRoleSelect("command")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-400">
                Command Center
              </CardTitle>
              <CardDescription className="text-blue-200">
                Access admin panel with surveillance feeds and monitoring tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-300">
                  <MapPin className="w-5 h-5" />
                  <span>Live Surveillance Feeds</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Threat Detection & Alerts</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                  <Radio className="w-5 h-5" />
                  <span>Team Coordination</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
