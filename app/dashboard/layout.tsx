import { AppSidebar } from "@/components/structure/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ReactNode } from "react"

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <SidebarProvider>
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <SidebarInset>
                {/* Header with Sidebar Trigger */}
                <header className="flex h-16 items-center gap-4 bg-gray-800 px-4 text-white shadow-md">
                    <SidebarTrigger className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition active:scale-110 duration-200" />
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </header>

                {/* Main Content Area */}
                <main className="p-4 bg-gray-900 min-h-screen">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}