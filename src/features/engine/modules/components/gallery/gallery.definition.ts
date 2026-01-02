import {
  IComponent,
  IComponentEvent,
  IContext,
  IComponentData,
} from "../../types/component.type";

// --- 1. Datos del Item ---

export interface IGalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  /** Datos extra para scripts */
  [key: string]: any;
}

// --- 2. Configuración de Acciones (Add Button & Context Menu) ---

export interface IContextMenuItem {
  label: string;
  /** Nombre del icono (ej: "Trash", "Edit") */
  icon?: string;
  variant?: "default" | "destructive";
  /** Evento al hacer click en la opción */
  onClick: IComponentEvent;
}

export interface IAddButtonConfig {
  label: string;
  icon?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  /** Evento al hacer click en agregar */
  onClick: IComponentEvent;
}

// --- 3. Configuración Visual ---

export interface IGalleryConfig {
  className?: string;
  /** Altura del contenedor (ej: "h-[500px]") */
  height?: string;
  /** Tamaño de las tarjetas (ej: "w-[300px] h-[200px]") */
  cardSize?: string;
  /** Activar barra de búsqueda interna */
  searchable?: boolean;

  /** Estilos granulares */
  style?: {
    gallery?: React.CSSProperties;
    card?: React.CSSProperties;
    img?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
  };

  // Configuración interna generada por el Builder (no tocar manualmente)
  _addButton?: Omit<IAddButtonConfig, "onClick">;
  _contextMenu?: Array<
    Omit<IContextMenuItem, "onClick"> & { separator?: boolean }
  >;
}

// --- 4. Datos Dinámicos ---

export interface IGalleryData {
  items?: IComponentData<IGalleryItem[]>;
}

// --- 5. Eventos y Props Principales ---

export interface IGalleryProps extends IGalleryData {
  id: string;
  config?: IGalleryConfig;
  context?: IContext;
  load?: () => void;

  // Evento principal
  onCardClick?: IComponentEvent;

  // Configuración Avanzada (se procesa en el Builder)
  addButton?: IAddButtonConfig;
  contextMenu?: (IContextMenuItem | { separator: true })[];
}

export type GalleryFactory = (props: IGalleryProps) => IComponent;

// --- 6. Definiciones para el Editor (Strings) ---

export const GALLERY_TYPE_DEFINITION = `
type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
};

interface IContextMenuItem {
  label: string;
  icon?: string;
  variant?: "default" | "destructive";
  onClick: IComponentEvent;
}

interface IAddButtonConfig {
  label: string;
  icon?: string;
  variant?: "default" | "outline";
  onClick: IComponentEvent;
}

interface IGalleryConfig {
  className?: string;
  height?: string;
  cardSize?: string;
  searchable?: boolean;
  style?: {
    gallery?: Record<string, any>;
    card?: Record<string, any>;
    img?: Record<string, any>;
    title?: Record<string, any>;
    description?: Record<string, any>;
  };
}

interface IGalleryProps {
  id: string;
  items?: IComponentData<GalleryItem[]>;
  config?: IGalleryConfig;
  
  // Eventos
  onCardClick?: IComponentEvent;
  
  // Acciones Avanzadas
  addButton?: IAddButtonConfig;
  contextMenu?: (IContextMenuItem | { separator: true })[];
}

/**
 * Crea una Galería de tarjetas con búsqueda, acciones y menú contextual.
 */
declare const Gallery: (props: IGalleryProps) => IComponent;
`;

const GALLERY_CONTEXT_EVENTS_DEFINITION = `
interface IGalleryExposedMethods {
  /** Reemplaza los items de la galería */
  setItems: (items: GalleryItem[]) => void;
  /** Obtiene los items actuales */
  getItems: () => GalleryItem[];
  /** Recarga los datos si provienen de una fuente externa */
  reload: () => void;
}

interface IGalleryMap {
  [id: string]: IGalleryExposedMethods;
}
`;

export const GALLERY_CONTEXT_EVENT = {
  key: "gallery",
  name: "IGalleryMap",
  definition: GALLERY_CONTEXT_EVENTS_DEFINITION,
};
