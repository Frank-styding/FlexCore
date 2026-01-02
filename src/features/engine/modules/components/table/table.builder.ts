import { IComponent } from "../../types/component.type";
import { TableFactory } from "./table.definition";

export const Table: TableFactory = ({
  id,
  config = {},
  columns,
  items,
  context,
  load,
  // Eventos planos
  onRowClick,
  onEdit,
  onDelete,
  onBulkDelete,
}) => {
  // Construcción de eventos
  const componentEvents: Record<string, any> = {};

  if (onRowClick) componentEvents.onRowClick = onRowClick;
  if (onEdit) componentEvents.onEdit = onEdit;
  if (onDelete) componentEvents.onDelete = onDelete;
  if (onBulkDelete) componentEvents.onBulkDelete = onBulkDelete;

  return {
    id,
    type: "Table",
    context,
    load,
    // Pasamos tanto columns como items dentro de data para ser procesados dinámicamente
    data: {
      columns,
      items, // Renombrado de 'data' a 'items' para claridad interna
    },
    config: {
      pageSize: 10, // Default actualizado a 10
      enableRowSelection: false,
      enableExport: true,
      ...config,
    },
    events: componentEvents,
  };
};
