import {
  IComponent,
  IComponentEvent,
  IContext,
  IComponentData,
} from "../../types/component.type";

// --- 1. Definición de Columnas ---

export interface ITableColumn {
  /** Clave de propiedad en el objeto de datos (ej: "nombre", "usuario.email") */
  accessorKey: string;
  /** Título de la columna */
  header: string;
  /** Permitir ordenar por esta columna */
  enableSorting?: boolean;
  /** Ancho sugerido (ej: "200px") */
  width?: string;
  /** Formato especial (ej: "currency", "date") - Para implementación futura */
  format?: string;
}

// --- 2. Configuración ---

export interface ITableConfig {
  className?: string;
  style?: React.CSSProperties;
  /** Número de filas por página */
  pageSize?: number;
  /** Permitir seleccionar filas con checkbox */
  enableRowSelection?: boolean;
  /** Mostrar botón de exportar a CSV */
  enableExport?: boolean;
}

// --- 3. Datos Dinámicos ---

export interface ITableData {
  /** Definición de columnas (puede ser dinámica) */
  columns: IComponentData<ITableColumn[]>;
  /** Array de datos a mostrar */
  items?: IComponentData<any[]>;
}

// --- 4. Eventos (Planos) ---

export interface ITableEvents {
  /** Click en una fila */
  onRowClick?: IComponentEvent;
  /** Click en botón editar (acción rápida) */
  onEdit?: IComponentEvent;
  /** Click en botón eliminar (acción rápida) */
  onDelete?: IComponentEvent;
  /** Click en eliminar selección múltiple */
  onBulkDelete?: IComponentEvent;
}

// --- 5. Props Principales ---

export interface ITableProps extends ITableData, ITableEvents {
  id: string;
  config?: ITableConfig;
  context?: IContext;
  load?: () => void;
}

export type TableFactory = (props: ITableProps) => IComponent;

// --- 6. Definiciones para el Editor (Strings) ---

export const TABLE_TYPE_DEFINITION = `
type TableColumn = {
  accessorKey: string;
  header: string;
  enableSorting?: boolean;
  width?: string;
};

interface ITableConfig {
  className?: string;
  style?: Record<string, any>;
  pageSize?: number;
  enableRowSelection?: boolean;
  enableExport?: boolean;
}

interface ITableProps {
  id: string;
  // Columnas dinámicas
  columns: IComponentData<TableColumn[]>;
  // Datos dinámicos
  items?: IComponentData<any[]>;
  
  config?: ITableConfig;
  
  // Eventos
  onRowClick?: IComponentEvent;
  onEdit?: IComponentEvent;
  onDelete?: IComponentEvent;
  onBulkDelete?: IComponentEvent;
}

/**
 * Crea una Tabla de datos con paginación, ordenamiento y selección.
 */
declare const Table: (props: ITableProps) => IComponent;
`;

const TABLE_CONTEXT_EVENTS_DEFINITION = `
interface ITableExposedMethods {
  /** Reemplaza los datos de la tabla */
  setData: (data: any[]) => void;
  /** Obtiene los datos actuales */
  getData: () => any[];
  /** Obtiene las filas seleccionadas actualmente */
  getSelectedRows: () => any[];
  /** Recarga los datos (si vienen de URL) */
  reload: () => void;
}

interface ITableMap {
  [id: string]: ITableExposedMethods;
}
`;

export const TABLE_CONTEXT_EVENT = {
  key: "table",
  name: "ITableMap",
  definition: TABLE_CONTEXT_EVENTS_DEFINITION,
};
