"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { DynamicBreadcrumb } from "./DynamicBreadcrumb";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/Tabs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="grid h-screen w-full min-w-0 grid-rows-[60px_1fr_50px] overflow-hidden transition-[width] duration-300 ease-linear">
        <div className="grid w-full grid-cols-[40px_auto_40px] items-center  p-2">
          <SidebarTrigger classNameIcon="size-6" className="p-5" />
          <div className="flex w-full items-center justify-center">
            <DynamicBreadcrumb />
          </div>
          <div className="flex h-full w-full items-center justify-center">
            <Button variant="ghost" size="icon" className="h-full w-full">
              <Edit className="size-6" />
            </Button>
          </div>
        </div>
        <div className="w-full overflow-auto bg-background">{children}</div>
        <footer className="w-full max-w-full overflow-hidden border-t bg-muted/30">
          <Tabs />
        </footer>
      </main>
    </SidebarProvider>
  );
}
