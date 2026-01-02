// components/custom/DashboardSidebar/DashboardSidebarModals.tsx
/* import { FormModal } from "@/components/custom/Modals/FormModal";
import { ConfirmModal } from "@/components/custom/Modals/ConfirmModal";
import { ConfigConnectionModal } from "@/components/custom/Modals/ConfigConnectionModal";
import { FieldConfig } from "@/components/custom/DynamicForm"; */
import { FieldConfig } from "@/components/shared/DynamicForm";
import { ConfirmModal } from "@/components/shared/modals/ConfirmModal";
import { FormModal } from "@/components/shared/modals/FormModal";
import { ConfigConnectionModal } from "@/features/editor/components/modals/ConfigConnectionModal";
import z from "zod";

const schema = z.object({
  name: z.string().min(4),
});

const fields: FieldConfig[] = [{ name: "name", label: "Nombre", type: "text" }];

interface DashboardSidebarModalsProps {
  addPageId: string;
  editPageId: string;
  confirmDeleteId: string;
  confirmConnectionId: string;
  onConfirmAdd: (data: Record<string, any>) => void;
  onConfirmEdit: (data: Record<string, string>) => void;
  onConfirmDelete: () => void;
}

export const DashboardSidebarModals: React.FC<DashboardSidebarModalsProps> = ({
  addPageId,
  editPageId,
  confirmDeleteId,
  confirmConnectionId,
  onConfirmAdd,
  onConfirmEdit,
  onConfirmDelete,
}) => {
  return (
    <>
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
};
