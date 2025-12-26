import { FieldConfig } from "@/components/custom/DynamicForm";
import { DynamicIcon, IconName } from "@/components/custom/DynamicIcon";
import { FormModal } from "@/components/custom/Modals/FormModal";
import { useModals } from "@/components/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Settings, LayoutDashboard, Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import z from "zod";
import { ConfirmModal } from "@/components/custom/Modals/ConfirmModal";
import { usePages } from "@/hooks/usePages";
import { ConfigConnectionModal } from "@/components/custom/Modals/ConfigConnectionModal";
import { useCallback, useEffect, useId, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchPages } from "@/lib/redux/features/pageSlice";
import { useParams, useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(4),
});

const fields: FieldConfig[] = [{ name: "name", label: "Nombre", type: "text" }];

export function DashbaordSidebar() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.pages.status);
  const router = useRouter();

  // Tipado seguro de params
  const params = useParams();
  const dashboardId = params.dashboardId as string;
  const pageId = params.pageId as string | undefined;

  const { pages, addPage, renamePage, deletePage } = usePages(dashboardId);
  const { openModal, closeModal, getModalData } = useModals();

  // IDs estables
  const addPageId = useId();
  const editPageId = useId();
  const confirmDeleteId = useId();
  const confirmConnectionId = useId();

  // 1. Efectos
  useEffect(() => {
    if (!dashboardId) {
      router.replace("/gallery");
    }
  }, [dashboardId, router]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPages());
    }
  }, [status, dispatch]);

  // 2. Handlers Memoizados (Optimizacion)
  const onAdd = useCallback(() => {
    openModal(addPageId);
  }, [openModal, addPageId]);

  const onConfirmAdd = useCallback(
    (data: Record<string, any>) => {
      addPage(data.name, "LayoutDashboard");
      closeModal(addPageId);
    },
    [addPage, closeModal, addPageId]
  );

  const onDelete = useCallback(
    (data: Record<string, any>) => {
      openModal(confirmDeleteId, data);
    },
    [openModal, confirmDeleteId]
  );

  const onConfirmDelete = useCallback(() => {
    const data = getModalData(confirmDeleteId);
    if (data?.id) {
      deletePage(data.id);
    }
  }, [getModalData, confirmDeleteId, deletePage]);

  const onEdit = useCallback(
    (data: Record<string, any>) => {
      openModal(editPageId, data);
    },
    [openModal, editPageId]
  );

  const onConfirmEdit = useCallback(
    (newData: Record<string, string>) => {
      const data = getModalData(editPageId);
      if (data?.id) {
        renamePage(data.id, newData.name);
        closeModal(editPageId);
      }
    },
    [getModalData, editPageId, renamePage, closeModal]
  );

  const onClickPage = useCallback(
    (targetPageId: string) => {
      // Usamos push para navegación normal (permite ir atrás)
      router.push(`/dashboard/${dashboardId}/page/${targetPageId}`);
    },
    [router, dashboardId]
  );

  const onSettings = useCallback(() => {
    openModal(confirmConnectionId);
  }, [openModal, confirmConnectionId]);

  // 3. Renderizado Condicional Limpio
  const renderContent = useMemo(() => {
    if (status === "loading") {
      return Array.from({ length: 3 }).map((_, i) => (
        <SidebarMenuItem key={i} className="px-2 py-2">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-4 w-4 rounded bg-sidebar-accent/50" />
            <div className="h-4 w-24 rounded bg-sidebar-accent/50" />
          </div>
        </SidebarMenuItem>
      ));
    }

    return pages?.map((item) => {
      // AQUÍ ESTÁ LA LÓGICA DE ACTIVACIÓN
      const isActive = item.id === pageId;

      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            asChild
            isActive={isActive} // <--- Propiedad clave para activar el estilo
            className="select-none cursor-pointer"
            onClick={() => onClickPage(item.id)}
          >
            <div>
              <DynamicIcon name={item.icon as IconName} />
              <span className="truncate">{item.name}</span>
            </div>
          </SidebarMenuButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild id={`trigger-${item.id}`}>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <span>Edit Page</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)}>
                <span>Delete Page</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    });
  }, [status, pages, pageId, onClickPage, onEdit, onDelete]);

  return (
    <>
      <Sidebar className="select-none" collapsible="icon">
        <SidebarHeader>
          <Button asChild variant="outline" className="justify-center px-2">
            <Link href="/gallery" className="w-full flex items-center gap-2">
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
              <SidebarMenu>{renderContent}</SidebarMenu>
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

      <FormModal
        className="gap-1"
        schema={schema}
        fields={fields}
        id={addPageId}
        title="Add Page"
        onSubmit={onConfirmAdd}
      />
      <FormModal
        className="gap-1"
        schema={schema}
        fields={fields}
        id={editPageId}
        title="Edit Page"
        onSubmit={onConfirmEdit}
      />
      <ConfirmModal
        onConfirm={onConfirmDelete}
        id={confirmDeleteId}
        description="Are you sure you want to delete this page?"
        title="Confirm Delete"
      />
      <ConfigConnectionModal
        id={confirmConnectionId}
        title="Config Connection"
        description="Set connection configuration"
      />
    </>
  );
}
