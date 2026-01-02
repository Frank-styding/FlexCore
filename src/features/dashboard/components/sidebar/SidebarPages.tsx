import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuAction } from "@/components/ui/sidebar";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { DynamicIcon, IconName } from "@/components/ui/dynamic-icon";

interface SidebarPagesProps {
  pages: any[];
  status: string;
  pageId: string | undefined;
  dashboardId: string;
  onEdit: (data: { id: string; name: string }) => void;
  onDelete: (data: { id: string }) => void;
}

export const SidebarPages: React.FC<SidebarPagesProps> = ({
  pages,
  status,
  pageId,
  dashboardId,
  onEdit,
  onDelete,
}) => {
  if (status === "loading") {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <SidebarMenuItem key={i} className="px-2 py-2"></SidebarMenuItem>
        ))}
      </>
    );
  }

  return (
    <SidebarMenu>
      {pages?.map((item) => {
        const isActive = item.id === pageId;
        const href = `/dashboard/${dashboardId}/page/${item.id}`;

        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className="select-none"
              tooltip={item.name}
            >
              <Link href={href}>
                <DynamicIcon name={item.icon as IconName} />
                <span className="truncate">{item.name}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side="right"
                align="start"
              >
                <DropdownMenuItem
                  onClick={() => onEdit({ id: item.id, name: item.name })}
                  className="cursor-pointer"
                >
                  <Pencil className="text-muted-foreground size-4 mr-2" />
                  <span>Rename Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete({ id: item.id })}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
                  <span>Delete Page</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
