import {
  IComponent,
  IComponentEvent,
  IContext,
} from "../../types/component.type";

// --- 1. Definición de Rutas (Recursiva) ---

export interface INavigationRoute {
  id: string;
  label: string;
  icon?: string;
  /** Componentes a renderizar cuando esta ruta está activa */
  children?: IComponent[];
  /** Sub-rutas anidadas */
  subRoutes?: INavigationRoute[];
}

// --- 2. Configuración ---

export interface INavigationConfig {
  className?: string;
  style?: React.CSSProperties;
  /** Etiqueta para el enlace de inicio en el breadcrumb */
  homeLabel?: string;
  /** Mostrar pestañas de navegación */
  showTabs?: boolean;
  /** Mostrar migas de pan (breadcrumb) */
  showBreadcrumb?: boolean;
}

// --- 3. Datos ---

export interface INavigationData {
  routes: INavigationRoute[];
}

// --- 4. Eventos (Planos) ---

export interface INavigationEvents {
  /** Se ejecuta al cambiar de ruta. Recibe el path como argumento. */
  onNavigate?: IComponentEvent;
}

// --- 5. Props Principales ---

export interface INavigationProps extends INavigationData, INavigationEvents {
  id: string;
  config?: INavigationConfig;
  context?: IContext;
  load?: () => void;
}

export type NavigationFactory = (props: INavigationProps) => IComponent;

// --- 6. Definiciones para el Editor (Strings) ---

export const NAVIGATION_TYPE_DEFINITION = `
type NavigationRoute = {
  id: string;
  label: string;
  icon?: string;
  children?: Component[];
  subRoutes?: NavigationRoute[];
};

interface INavigationConfig {
  className?: string;
  style?: Record<string, any>;
  homeLabel?: string;
  showTabs?: boolean;
  showBreadcrumb?: boolean;
}

interface INavigationProps {
  id: string;
  routes: NavigationRoute[];
  config?: INavigationConfig;
  
  // Eventos
  onNavigate?: IComponentEvent;
}

/**
 * Crea un sistema de navegación con soporte para rutas anidadas, tabs y breadcrumbs.
 */
declare const Navigation: (props: INavigationProps) => IComponent;
`;

// API expuesta para scripts (nav.navigate, etc.)
const NAVIGATION_CONTEXT_EVENTS_DEFINITION = `
interface INavigationExposedMethods {
  /** Navega programáticamente a una ruta */
  navigate: (routePath: string, data?: any) => void;
  /** Obtiene la ruta actual (ej: "settings/profile") */
  getCurrentPath: () => string;
  /** Obtiene los datos asociados a la navegación actual */
  getRouteData: () => any;
}

interface INavigationMap {
  [id: string]: INavigationExposedMethods;
}
`;

export const NAVIGATION_CONTEXT_EVENT = {
  key: "nav",
  name: "INavigationMap",
  definition: NAVIGATION_CONTEXT_EVENTS_DEFINITION,
};
