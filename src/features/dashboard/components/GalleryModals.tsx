import { ConfirmModal } from "@/components/shared/modals/ConfirmModal";
import { FormModal } from "@/components/shared/modals/FormModal";
import { DASHBOARD_FIELDS, DASHBOARD_SCHEMA } from "../types/dashboard.types";
import { LoadingModal } from "@/components/shared/modals/LoadingModal";

interface GalleryModalsProps {
  addFormId: string;
  editFormId: string;
  confirmId: string;
  loadingModalId: string;
  onConfirm: (data: { name: string }) => void;
  onConfirmEdit: (data: { name: string }) => void;
  onConfirmDelete: () => void;
}

export const GalleryModals = ({
  addFormId,
  editFormId,
  confirmId,
  loadingModalId,
  onConfirm,
  onConfirmEdit,
  onConfirmDelete,
}: GalleryModalsProps) => {
  return (
    <>
      <FormModal
        id={addFormId}
        title="Nuevo Dashboard"
        schema={DASHBOARD_SCHEMA}
        fields={DASHBOARD_FIELDS}
        confirmName="Dashboard"
        submitLabel="Crear"
        onSubmit={onConfirm}
      />
      <FormModal
        id={editFormId}
        title="Editar Dashboard"
        schema={DASHBOARD_SCHEMA}
        fields={DASHBOARD_FIELDS}
        confirmName="Dashboard"
        submitLabel="Guardar"
        onSubmit={onConfirmEdit}
      />
      <ConfirmModal
        id={confirmId}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que quieres eliminar este dashboard? Esta acción no se puede deshacer."
        confirmName="Eliminar"
        onConfirm={onConfirmDelete}
      />
      <LoadingModal id={loadingModalId} />
    </>
  );
};
