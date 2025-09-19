import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Map,
  AlertTriangle,
  Users,
  Settings,
  BarChart3,
  Radio,
  Target,
  Camera,
  Zap,
} from "lucide-react";

const navigationItems = [
  {
    title: "Command Dashboard",
    url: "/",
    icon: Shield,
    badge: null,
  },
  {
    title: "Surveillance Center",
    url: "/surveillance",
    icon: Eye,
    badge: "8 FEEDS",
  },
  {
    title: "Tactical Map",
    url: "/map",
    icon: Map,
    badge: null,
  },
  {
    title: "Alert Management",
    url: "/alerts",
    icon: AlertTriangle,
    badge: "3 ACTIVE",
  },
  {
    title: "Troop Tracking",
    url: "/troops",
    icon: Users,
    badge: "24 ONLINE",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    badge: null,
  },
];

const systemItems = [
  {
    title: "Communications",
    url: "/comms",
    icon: Radio,
    badge: null,
  },
  {
    title: "Weapons Detection",
    url: "/weapons",
    icon: Target,
    badge: "AI ACTIVE",
  },
  {
    title: "Camera Network",
    url: "/cameras",
    icon: Camera,
    badge: "12 ONLINE",
  },
  {
    title: "System Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium border-l-2 border-primary" 
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-grid-primary p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">RAKSH KAVACH</h1>
              <p className="text-xs text-muted-foreground">Defense Command System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            MISSION CONTROL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-primary/20 text-primary"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            DEFENSE SYSTEMS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="outline" 
                              className="text-xs border-status-active text-status-active"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Panel */}
        {!isCollapsed && (
          <div className="mt-auto p-3 bg-accent rounded-lg mx-2 mb-2">
            <h4 className="text-xs font-medium text-foreground mb-2">SYSTEM STATUS</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Defense Level:</span>
                <Badge variant="destructive" className="text-xs">HIGH</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AI Status:</span>
                <Badge variant="outline" className="text-xs border-status-active text-status-active">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Network:</span>
                <Badge variant="outline" className="text-xs border-status-active text-status-active">SECURE</Badge>
              </div>
              <div className="text-xs text-muted-foreground pt-1 border-t border-grid-primary">
                Last Update: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}