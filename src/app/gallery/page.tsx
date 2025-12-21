/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FieldConfig } from "@/components/custom/DynamicForm";
import { ConfirmModal } from "@/components/custom/Modals/ConfirmModal";
import { FormModal } from "@/components/custom/Modals/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { DashboardCard } from "./DashboardCard";
import { useDashboarGallery } from "./useDashboardGallery";

const carSchema = z.object({
  name: z.string().min(4),
});

const carFields: FieldConfig[] = [
  { name: "name", label: "nombre", type: "text" },
];

export default function DashbaordGallery() {
  const {
    data,
    value,
    onChange,
    onClick,
    onAdd,
    onDelete,
    onConfirmDelete,
    onConfirm,
    onEdit,
    onConfirmEdit,
  } = useDashboarGallery();

  return (
    <div className="p-8 flex flex-col">
      <div className="mb-10 pt-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="w-full ">
        <div className="w-full h-20 flex gap-4">
          <Input
            onChange={onChange}
            placeholder="Buscar dashbaord"
            value={value}
          />
          <Button variant="default" onClick={onAdd}>
            Nuevo Dashboard
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {data.length === 0 ? (
            <p className="text-gray-500">No se encontraron dashboards.</p>
          ) : (
            data.map((dashboard, index) => (
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
            id="add-dashboard"
            title="New Dashboard"
            schema={carSchema}
            fields={carFields}
            confirmName="Dashboard"
            onSubmit={onConfirm}
          />

          <FormModal
            id="edit-dashboard"
            title="Edit Dashboard"
            schema={carSchema}
            fields={carFields}
            confirmName="Dashboard"
            onSubmit={onConfirmEdit}
          />

          <ConfirmModal
            id="confirm"
            title="Confirmar"
            onConfirm={onConfirmDelete}
          />
        </div>
      </div>
    </div>
  );
}
