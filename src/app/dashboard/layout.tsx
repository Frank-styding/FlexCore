"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { DashbaordSidebar } from "./DashboardSidebar";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentEditorModal } from "../../components/custom/CreateComponentModal";
import { useModals } from "@/components/providers/ModalProvider";

export default function Layout({ children }: { children: ReactNode }) {
  const { openModal } = useModals();

  const onSettings = () => {
    openModal("create-component");
  };

  return (
    <SidebarProvider>
      <DashbaordSidebar />
      <main className="grid h-screen w-full min-w-0 grid-rows-[60px_1fr] overflow-hidden transition-[width] duration-300 ease-linear">
        <div className="grid w-full grid-cols-[40px_auto_40px] items-center  p-2">
          <SidebarTrigger classNameIcon="size-6" className="p-5" />
          <div />
          <div className="flex h-full w-full items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-full"
              onClick={onSettings}
            >
              <Settings className="size-6" />
            </Button>
          </div>
        </div>
        <div className="w-full overflow-auto bg-background">{children}</div>
      </main>
      <ComponentEditorModal id="create-component" />;
    </SidebarProvider>
  );
}
