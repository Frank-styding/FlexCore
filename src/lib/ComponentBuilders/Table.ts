import {
  BuildFuncs,
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
  enableRowSelection?: boolean; // Nuevo: Activar checkboxes
  enableExport?: boolean; // Nuevo: Activar botón exportar
};

export type TableEvent = {
  setData: (data: any[]) => void;
  getData: () => any[];
  getSelectedRows: () => any[];
};

type TableData = {
  id: string;
  config?: TableConfig;
  columns: TableColumn[];
  data?: IComponentData<DynamicValue<any[]>>;
  onRowClick: ComponentEvent;

  // Nuevos Eventos de Acción
  onEdit: ComponentEvent; // (item) => void
  onDelete: ComponentEvent; // (item) => void
  onBulkDelete: ComponentEvent; // (items[]) => void

  buildFuncs: BuildFuncs;
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
  buildFuncs,
  context,
}) => {
  return {
    id,
    type: "Table",
    context,
    data: { columns, items: data },
    config: config ?? {
      pageSize: 5,
      enableRowSelection: false,
      enableExport: true,
    },
    events: { onRowClick, onEdit, onDelete, onBulkDelete }, // Pasamos los nuevos eventos
    buildFuncs,
  };
};

// String Types para el Editor
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
  columns: TableColumn[];
  data?: IComponentData<DynamicValue<any[]>>;
  config?: TableConfig;
  onRowClick?: ComponentEvent;
  onEdit?: ComponentEvent;
  onDelete?: ComponentEvent;
  onBulkDelete?: ComponentEvent;
  buildFuncs?: BuildFuncs;
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
};

interface TableMap {
  [id: string]: TableEvent;
}
`;
