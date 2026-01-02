import {
  IComponent,
  IComponentEvent,
  IContext,
} from "../../types/component.type";

// --- 1. Configuración ---

/**
 * Configuración visual del contenedor (Layout).
 */
export interface ILayoutConfig {
  /** Clases CSS (Tailwind) */
  className?: string;
  /** Estilos en línea */
  style?: React.CSSProperties;
  /** ID para anclas de navegación o pruebas */
  htmlId?: string;
}

// --- 2. Eventos (Estructura Plana para DX) ---

export interface ILayoutEvents {
  /** Click en el contenedor */
  onClick?: IComponentEvent;
  onMouseEnter?: IComponentEvent;
  onMouseLeave?: IComponentEvent;
}

// --- 3. Props Principales ---

/**
 * Propiedades del Layout.
 * Nota: Los hijos (children) se pasan como segundo argumento en el Builder.
 */
export interface ILayoutProps extends ILayoutEvents {
  id: string;
  config?: ILayoutConfig;
  context?: IContext;
}

// Definimos el Factory que acepta props y un array de hijos
export type LayoutFactory = (
  props: ILayoutProps,
  children?: IComponent[]
) => IComponent;

// --- 4. Definiciones para el Editor (Strings) ---

export const LAYOUT_TYPE_DEFINITION = `
interface ILayoutConfig {
  className?: string;
  /** Estilos CSS. Ej: { display: 'flex', gap: '10px' } */
  style?: Record<string, any>;
  htmlId?: string;
}

interface ILayoutProps {
  id: string;
  config?: ILayoutConfig;
  
  // Eventos
  onClick?: IComponentEvent;
  onMouseEnter?: IComponentEvent;
  onMouseLeave?: IComponentEvent;
}

/** * Crea un contenedor Layout.
 * @param props Configuración e ID
 * @param children Lista de componentes hijos
 */
declare const Layout: (props: ILayoutProps, children?: IComponent[]) => IComponent;
`;

// Contexto (Por si en el futuro quieres exponer métodos como scrollTo)
const LAYOUT_CONTEXT_EVENTS_DEFINITION = `
interface ILayoutExposedMethods {
  // Puedes agregar métodos aquí en el futuro (ej: scrollIntoView)
}

interface ILayoutMap {
  [id: string]: ILayoutExposedMethods;
}
`;

export const LAYOUT_CONTEXT_EVENT = {
  key: "layout",
  name: "ILayoutMap",
  definition: LAYOUT_CONTEXT_EVENTS_DEFINITION,
};
