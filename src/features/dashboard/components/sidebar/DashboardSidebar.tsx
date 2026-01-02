// components/custom/DashboardSidebar/DashboardSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useDashboardSidebar } from "./useDashboardSidebar";
import { SidebarPages } from "./SidebarPages";
import { DashboardSidebarModals } from "./DashboardSidebarModals";

export function DashboardSidebar() {
  const {
    status,
    pages,
    pageId,
    dashboardId,
    addPageId,
    editPageId,
    confirmDeleteId,
    confirmConnectionId,
    onAdd,
    onConfirmAdd,
    onDelete,
    onConfirmDelete,
    onEdit,
    onConfirmEdit,
    onSettings,
  } = useDashboardSidebar();

  return (
    <>
      <Sidebar className="select-none">
        <SidebarHeader>
          <Button asChild variant="outline" className="justify-center px-2">
            <Link href="/dashboard" className="w-full flex items-center gap-2">
              <LayoutDashboard className="size-5" />
              <span>Gallery</span>
            </Link>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg h-10">
              Pages
            </SidebarGroupLabel>
            <SidebarGroupAction
              title="Add Page"
              className="size-8"
              onClick={onAdd}
            >
              <Plus className="size-4" />
              <span className="sr-only">Add Page</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarPages
                pages={pages}
                status={status}
                pageId={pageId}
                dashboardId={dashboardId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <Button
            asChild
            variant="ghost"
            onClick={onSettings}
            className="w-full justify-start cursor-pointer px-2"
          >
            <div className="flex items-center gap-2">
              <Settings className="size-5" />
              <span>Settings</span>
            </div>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <DashboardSidebarModals
        addPageId={addPageId}
        editPageId={editPageId}
        confirmDeleteId={confirmDeleteId}
        confirmConnectionId={confirmConnectionId}
        onConfirmAdd={onConfirmAdd}
        onConfirmEdit={onConfirmEdit}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}
