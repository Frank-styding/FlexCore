import {
  Component,
  ComponentEvent,
  DynamicValue,
  Context,
  IComponentData,
} from "./Component";

export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
};

// --- Tipos Nuevos ---
type ContextMenuItemConfig = {
  label: string;
  icon?: "Trash" | "Edit" | "Copy" | "Eye" | "Settings"; // Iconos soportados
  variant?: "default" | "destructive";
  onClick: ComponentEvent; // La función a ejecutar
};

type AddButtonConfig = {
  label: string;
  icon?: string;
  variant?: string;
  onClick: ComponentEvent;
};
// --------------------

type GalleryConfig = {
  className?: string;
  searchable?: boolean;
  cardSize?: string;
  height?: string;
  style?: Record<string, any>;
  // Config interna (se llena automáticamente)
  addButton?: { label: string; icon?: string };
  contextMenu?: Array<{
    label: string;
    icon?: string;
    variant?: string;
    separator?: boolean;
  }>;
};

export type GalleryEvent = {
  setItems: (items: GalleryItem[]) => void;
  getItems: () => GalleryItem[];
  reload: () => void;
};

export interface GalleryMap {
  [id: string]: GalleryEvent;
}

type GalleryData = {
  id: string;
  config?: Omit<GalleryConfig, "addButton" | "contextMenu">; // Excluimos para pasarlos explícitamente
  items?: IComponentData<DynamicValue<GalleryItem[]>>;
  context?: Context;

  // Eventos Principales
  onCardClick?: ComponentEvent;

  // Nuevas Propiedades
  addButton?: AddButtonConfig;
  contextMenu?: (ContextMenuItemConfig | { separator: true })[];
};

type GalleryFactory = (data: GalleryData) => Component;

export const Gallery: GalleryFactory = ({
  id,
  config,
  items,
  onCardClick,
  addButton,
  contextMenu,
  context,
}) => {
  // 1. Procesar eventos del menú contextual
  // Convertimos el array de objetos con funciones a:
  // - config: array de datos planos (label, icon)
  // - events: mapa de funciones (onContextAction_0, onContextAction_1...)
  const contextEvents: Record<string, ComponentEvent> = {};
  const contextConfig = contextMenu?.map((item, index) => {
    if ("separator" in item) return { separator: true };

    // Guardamos la función en el objeto de eventos con un nombre indexado
    contextEvents[`onContextAction_${index}`] = item.onClick;

    return {
      label: item.label,
      icon: item.icon,
      variant: item.variant,
    };
  });

  // 2. Procesar botón de agregar
  const addEvents: Record<string, ComponentEvent> = {};
  let addButtonConfig: any = undefined;

  if (addButton) {
    addEvents["onAddClick"] = addButton.onClick;
    addButtonConfig = {
      label: addButton.label,
      icon: addButton.icon,
      variant: addButton.variant,
    };
  }

  return {
    id,
    type: "Gallery",
    context,
    data: { items },
    config: {
      ...(config ?? { searchable: true }),
      addButton: addButtonConfig,
      contextMenu: contextConfig,
    },
    events: {
      onCardClick: onCardClick || (() => {}),
      ...contextEvents,
      ...addEvents,
    },
  };
};

// --- Definición para Intellisense (Editor) ---
export const GalleryType = `
type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;

};

type ContextMenuItem = {
  label: string;
  icon?: "Trash" | "Edit" | "Copy" | "Eye" | "Settings";
  variant?: "default" | "destructive" | "outline";
  onClick?: (item: GalleryItem, ctx: Context) => void;
};

type AddButtonConfig = {
  label: string;
  icon?: string;
  variant?: "outline"| "default";
  onClick: (e: any, ctx: Context) => void;
};

interface GalleryProps {
  id: string;
  items?: IComponentData<DynamicValue<GalleryItem[]>>;
  
  // Configuración UI básica
  config?: {
    className?: string;
    searchable?: boolean;
    cardSize?: string;
    height?: string;
    style?: {
      gallery?:Record<string,any>;
      title?: Record<string, any>;
      description?: Record<string, any>;
      img?: Record<string, any>;
      card?: Record<string, any>;
    };
  };

  // Acciones
  onCardClick?: (item: GalleryItem, ctx: Context) => void;
  
  // Nuevas funcionalidades
  addButton?: AddButtonConfig;
  contextMenu?: (ContextMenuItem | { separator: true })[];
  
  context?: Context;
}

declare const Gallery: (data: GalleryProps) => Component;
`;

export const GalleryEventsType = `
type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
};

type GalleryEvent = {
  setItems: (items: GalleryItem[]) => void;
  getItems: () => GalleryItem[];
  reload:()=>void;
};

interface GalleryMap {
  [id: string]: GalleryEvent; 
}
`;
