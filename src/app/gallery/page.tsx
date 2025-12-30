"use client";
import { FieldConfig } from "@/components/custom/DynamicForm";
import { ConfirmModal } from "@/components/custom/Modals/ConfirmModal";
import { FormModal } from "@/components/custom/Modals/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { DashboardCard } from "./DashboardCard";
import { useDashboarGallery } from "./useDashboardGallery";
import { LoadingModal } from "@/components/custom/Modals/LoadingModal";
// Importamos el icono de LogOut
import { LogOut } from "lucide-react";

const carSchema = z.object({
  name: z.string().min(4),
});

const carFields: FieldConfig[] = [
  { name: "name", label: "nombre", type: "text" },
];

export default function DashbaordGallery() {
  const {
    results,
    query,
    onChange,
    onClick,
    onAdd,
    onDelete,
    onConfirmDelete,
    onConfirm,
    onEdit,
    addFormId,
    editFormId,
    confirmId,
    loadingModalId,
    onConfirmEdit,
    // Obtenemos la función del hook
    onSignOut,
  } = useDashboarGallery();

  return (
    <div className="p-8 flex flex-col">
      {/* Modificamos el header para que sea flex y separe el título del botón */}
      <div className="mb-10 pt-2 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Botón de Cerrar Sesión */}
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="w-full ">
        <div className="w-full h-20 flex gap-4">
          <Input
            onChange={onChange}
            placeholder="Buscar dashbaord"
            value={query}
          />
          <Button variant="default" onClick={onAdd}>
            Nuevo Dashboard
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {results.length === 0 ? (
            <p className="text-gray-500">No se encontraron dashboards.</p>
          ) : (
            results.map((dashboard, index) => (
              <DashboardCard
                key={index}
                name={dashboard.name}
                onClick={() => onClick(dashboard.id)}
                onEdit={() => onEdit(dashboard.id)}
                onDelete={() => onDelete(dashboard.id)}
              />
            ))
          )}

          <FormModal
            id={addFormId}
            title="New Dashboard"
            schema={carSchema}
            fields={carFields}
            confirmName="Dashboard"
            onSubmit={onConfirm}
          />

          <FormModal
            id={editFormId}
            title="Edit Dashboard"
            schema={carSchema}
            fields={carFields}
            confirmName="Dashboard"
            onSubmit={onConfirmEdit}
          />

          <ConfirmModal
            id={confirmId}
            title="Confirmar"
            onConfirm={onConfirmDelete}
          />
          <LoadingModal id={loadingModalId} />
        </div>
      </div>
    </div>
  );
}
