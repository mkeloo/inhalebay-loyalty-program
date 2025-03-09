import { AppSidebar } from "@/components/structure/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/structure/ToggleMode";
import { Card } from "@/components/ui/card";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <SidebarInset>
        {/* Header with Sidebar Trigger */}
        <header className="flex h-16 items-center justify-between gap-4 px-4 shadow-md">
          <div className="flex items-center justify-center gap-4 ">
            <SidebarTrigger className="p-2 rounded  transition active:scale-110 duration-200" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div>
            <ModeToggle />
          </div>
        </header>

        {/* Main Content Area */}
        <Card className="p-4 min-h-[calc(100vh-4rem)] w-full z-1">
          {children}
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
