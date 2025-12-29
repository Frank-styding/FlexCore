import {
  BuildFuncs,
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

type GalleryConfig = {
  className?: string;
  searchable?: boolean; // Nuevo: Activar barra de búsqueda
  cardSize?: string; // Opcional: para sobreescribir el tamaño "15"
  height?: string; // Nuevo: ej. "h-[500px]" o "max-h-[60vh]"
  style?: Record<string, any>;
};

export type GalleryEvent = {
  setItems: (items: GalleryItem[]) => void;
  getItems: () => GalleryItem[];
};

export interface GalleryMap {
  [id: string]: GalleryEvent;
}

type GalleryData = {
  id: string;
  config?: GalleryConfig;
  onCardClick: ComponentEvent;
  buildFuncs: BuildFuncs;
  context?: Context;
  items?: IComponentData<DynamicValue<GalleryItem[]>>;
};

type GalleryFactory = (data: GalleryData) => Component;

export const Gallery: GalleryFactory = ({
  id,
  config,
  items,
  onCardClick,
  buildFuncs,
  context,
}) => {
  return {
    id,
    type: "Gallery",
    context,
    data: { items },
    config: config ?? { searchable: true }, // Buscador activo por defecto
    events: { onCardClick },
    buildFuncs,
  };
};

// Definición para el editor (Intellisense)
export const GalleryType = `
type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
};

type GalleryConfig = {
  className?: string;
  searchable?: boolean;
  cardSize?: string;
  style?: Record<string,any>;
  height?: string;
};

interface GalleryProps {
  id: string;
  items?: IComponentData<DynamicValue<GalleryItem[]>>;
  config?: GalleryConfig;
  onCardClick?: ComponentEvent;
  buildFuncs?: BuildFuncs;
  context?: Context;
}

interface GalleryFactory {
  (data: GalleryProps): Component;
}

declare const Gallery: GalleryFactory;
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
};

interface GalleryMap {
  [id: string]: GalleryEvent; 
}
`;
