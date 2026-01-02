"use client";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/sidebar";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { useDashboard } from "@/features/dashboard/hook/useDashboard";
import { LoadingIndicator } from "@/features/dashboard/components/LoadingIndicator";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const {
    currentPage,
    loadingId,
    handlePublicToggle,
    handleOpenView,
    handleOpenSettings,
  } = useDashboard();
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="grid h-screen w-full min-w-0 grid-rows-[60px_1fr] overflow-hidden transition-[width] duration-300 ease-linear">
        <DashboardHeader
          currentPage={currentPage}
          onPublicToggle={handlePublicToggle}
          onOpenView={handleOpenView}
          onSettings={handleOpenSettings}
        />
        <div className="w-full overflow-auto bg-background">{children}</div>
      </main>
      <LoadingIndicator loadingId={loadingId} />
    </SidebarProvider>
  );
}
