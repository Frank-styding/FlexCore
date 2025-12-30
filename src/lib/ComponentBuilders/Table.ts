import {
  Component,
  ComponentEvent,
  DynamicValue,
  Context,
  IComponentData,
} from "./Component";

export type TableColumn = {
  accessorKey: string;
  header: string;
  enableSorting?: boolean;
  width?: string;
};

type TableConfig = {
  className?: string;
  pageSize?: number;
  enableRowSelection?: boolean;
  enableExport?: boolean;
};

export type TableEvent = {
  setData: (data: any[]) => void;
  getData: () => any[];
  getSelectedRows: () => any[];
  reload: () => void; // NUEVO: Método reload
};

type TableData = {
  id: string;
  config?: TableConfig;
  // CAMBIO: Ahora columns es dinámico
  columns: IComponentData<DynamicValue<TableColumn[]>>;
  data?: IComponentData<DynamicValue<any[]>>;

  onRowClick: ComponentEvent;
  onEdit: ComponentEvent;
  onDelete: ComponentEvent;
  onBulkDelete: ComponentEvent;

  context?: Context;
};

type TableFactory = (data: TableData) => Component;

export const Table: TableFactory = ({
  id,
  config,
  columns,
  data,
  onRowClick,
  onEdit,
  onDelete,
  onBulkDelete,
  context,
}) => {
  return {
    id,
    type: "Table",
    context,
    // Pasamos tanto columns como items dentro de data para ser procesados
    data: { columns, items: data },
    config: config ?? {
      pageSize: 5,
      enableRowSelection: false,
      enableExport: true,
    },
    events: { onRowClick, onEdit, onDelete, onBulkDelete },
  };
};

// --- String Types para el Editor (Actualizados) ---
export const TableType = `
type TableColumn = {
  accessorKey: string;
  header: string;
  enableSorting?: boolean;
  width?: string;
};

type TableConfig = {
  className?: string;
  pageSize?: number;
  enableRowSelection?: boolean;
  enableExport?: boolean;
};

interface TableProps {
  id: string;
  // CAMBIO: Definición dinámica para el editor
  columns: IComponentData<DynamicValue<TableColumn[]>>;
  data?: IComponentData<DynamicValue<any[]>>;
  config?: TableConfig;
  onRowClick?: ComponentEvent;
  onEdit?: ComponentEvent;
  onDelete?: ComponentEvent;
  onBulkDelete?: ComponentEvent;
  context?: Context;
}

interface TableFactory {
  (data: TableProps): Component;
}

declare const Table: TableFactory;
`;

export const TableEventsType = `
type TableEvent = {
  setData: (data: any[]) => void;
  getData: () => any[];
  getSelectedRows: () => any[];
  reload: () => void;
};

interface TableMap {
  [id: string]: TableEvent;
}
`;
