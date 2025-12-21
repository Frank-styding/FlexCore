/* eslint-disable @typescript-eslint/no-explicit-any */
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
  addPage,
  deletePage,
  updatePage,
} from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
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
import { useRouterSync } from "@/hooks/useRouterSync";

const schema = z.object({
  name: z.string().min(4),
});

const fields: FieldConfig[] = [{ name: "name", label: "nombre", type: "text" }];

export function DashbaordSidebar() {
  const { data, navigate } = useRouterSync();

  const { dashboardId } = data;

  const pages = useAppSelector(
    (item) =>
      item.dashboard.dashboards.find((item) => item.id == dashboardId)?.pages
  );

  const dispatch = useAppDispatch();

  const { openModal, closeModal, getModalData } = useModals();

  const onAdd = () => openModal("add-page");

  const onConfirm = (data: Record<string, any>) => {
    dispatch(
      addPage({
        dashboardId,
        page: { name: data.name, icon: "LayoutDashboard" },
      })
    );
    closeModal("add-page");
  };

  const onDelete = (data: Record<string, any>) => {
    openModal("confirm-delete-page", data);
  };

  const onConfirmDelete = () => {
    const data = getModalData("confirm-delete-page");
    dispatch(
      deletePage({
        dashboardId,
        page: { id: data.id },
      })
    );
  };
  const onEdit = (data: Record<string, any>) => {
    openModal("edit-page", data);
  };

  const onConfirmEdit = (newData: Record<string, string>) => {
    const data = getModalData("edit-page");
    dispatch(
      updatePage({
        dashboardId,
        page: { name: newData.name, id: data.id },
      })
    );
    closeModal("edit-page");
  };

  const onClick = (pageId: string) => {
    navigate("/dashboard/page", { dashboardId, pageId });
  };

  return (
    <>
      <Sidebar className="select-none">
        <SidebarHeader>
          <Button asChild variant="outline">
            <Link href="/gallery" className="w-full flex">
              <LayoutDashboard className="w-10 h-10 " />
              <span>Galley</span>
            </Link>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg h-10">
              Pages
            </SidebarGroupLabel>
            <SidebarGroupAction
              title="Add Project"
              className="size-8"
              onClick={onAdd}
            >
              <Plus className="min-w-5 min-h-5 " />
              <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {pages?.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      className="select-none"
                      onClick={() => onClick(item.id)}
                    >
                      <div>
                        <DynamicIcon name={item.icon as IconName} />
                        <span>{item.name}</span>
                      </div>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild id={`trigger-${item.name}`}>
                        <SidebarMenuAction>
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
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <Button asChild variant="outline">
            <div className="">
              <Settings className="w-10 h-10 " />
              <span>Settings</span>
            </div>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <FormModal
        className="gap-1"
        schema={schema}
        fields={fields}
        id="add-page"
        title="Add Page"
        onSubmit={onConfirm}
      />
      <FormModal
        className="gap-1"
        schema={schema}
        fields={fields}
        id="edit-page"
        title="Edit Page"
        onSubmit={onConfirmEdit}
      />
      <ConfirmModal
        onConfirm={onConfirmDelete}
        id="confirm-delete-page"
        description="¿ Esta seguro ?"
        title="Confirm delete"
      />
    </>
  );
}
