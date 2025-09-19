import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { CommandButton } from "@/components/ui/command-button";
import { Bell, User, Power } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-14 flex items-center justify-between px-4 border-b border-grid-primary bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="animate-pulse">
                  DEFENSE LEVEL: HIGH
                </Badge>
                <Badge variant="outline" className="border-status-active text-status-active">
                  ALL SYSTEMS OPERATIONAL
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
              </div>
              
              <CommandButton variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs">
                  3
                </Badge>
              </CommandButton>
              
              <CommandButton variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </CommandButton>
              
              <CommandButton variant="ghost" size="sm">
                <Power className="w-4 h-4" />
              </CommandButton>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}