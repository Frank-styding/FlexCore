import { FieldConfig } from "@/components/shared/DynamicForm";
import z from "zod";

export interface DatabaseConfig {
  type: string;
  url: string;
  key: string;
}

export interface LoadingState {
  pages: "idle" | "loading" | "succeeded" | "failed";
  dashboards: "idle" | "loading" | "succeeded" | "failed";
}

export interface DashboardHeaderProps {
  currentPage?: {
    id: string;
    isPublic?: boolean;
  } | null;
  onPublicToggle: (checked: boolean) => void;
  onOpenView: () => void;
  onSettings: () => void;
}

export interface ConnectionState {
  hasConnected: boolean;
  isModalOpen: boolean;
}
export interface Dashboard {
  id: string;
  name: string;
  config: Record<string, any>;
  configScript: string;
}

export interface DashboardCardProps {
  name: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface DashboardCardData {
  id: string;
  name: string;
}

export interface GalleryModals {
  addFormId: string;
  editFormId: string;
  confirmId: string;
  loadingModalId: string;
}

export interface GalleryHandlers {
  query: string;
  results: DashboardCardData[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (dashboardId: string) => void;
  onAdd: () => void;
  onDelete: (dashboardId: string) => void;
  onConfirmDelete: () => void;
  onConfirm: (data: { name: string }) => void;
  onEdit: (dashboardId: string) => void;
  onConfirmEdit: (data: { name: string }) => void;
  onSignOut: () => void;
}

export const DASHBOARD_SCHEMA = z.object({
  name: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
});

export const DASHBOARD_FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Ingresa el nombre del dashboard",
  },
];
