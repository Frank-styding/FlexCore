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
import { useRouter } from "next/navigation";
import { Modal } from "@/components/custom/Modal";
import { ScriptEditor } from "@/components/custom/ComponentEditor/ScriptEditor";
import { ConfigConnectionModal } from "@/components/custom/Modals/ConfigConnectionModal";
import { useId } from "react";

const schema = z.object({
  name: z.string().min(4),
});

const fields: FieldConfig[] = [{ name: "name", label: "nombre", type: "text" }];

export function DashbaordSidebar() {
  const router = useRouter();

  const { pages, addPage, renamePage, deletePage, selectPage } = usePages();
  const { openModal, closeModal, getModalData } = useModals();

  const addPageId = useId();
  const editPageId = useId();
  const confirmDeleteId = useId();
  const confirmConnecitonId = useId();

  const onAdd = () => openModal(addPageId);

  const onConfirm = (data: Record<string, any>) => {
    addPage(data.name, "LayoutDashboard");
    closeModal(addPageId);
  };

  const onDelete = (data: Record<string, any>) => {
    openModal(confirmDeleteId, data);
  };

  const onConfirmDelete = () => {
    const data = getModalData(confirmDeleteId);
    deletePage(data.id);
  };
  const onEdit = (data: Record<string, any>) => {
    openModal(editPageId, data);
  };

  const onConfirmEdit = (newData: Record<string, string>) => {
    const data = getModalData(editPageId);
    renamePage(data.id, newData.name);
    closeModal(editPageId);
  };

  const onClick = (pageId: string) => {
    selectPage(pageId);
    router.push("/dashboard/page");
  };

  const onSettings = () => {
    openModal(confirmConnecitonId);
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
          <Button asChild variant="outline" onClick={onSettings}>
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
        id={addPageId}
        title="Add Page"
        onSubmit={onConfirm}
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
        description="¿ Are you sure ?"
        title="Confirm delete"
      />
      <ConfigConnectionModal
        id={confirmConnecitonId}
        title="Config connection"
        description="set connection config"
      />
    </>
  );
}
