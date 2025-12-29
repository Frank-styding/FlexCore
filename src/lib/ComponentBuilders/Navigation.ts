import { Component, ComponentEvent, Context } from "./Component";

export type NavigationRoute = {
  id: string;
  label: string;
  icon?: string;
  children?: Component[];
  subRoutes?: NavigationRoute[];
};

type NavigationConfig = {
  className?: string;
  homeLabel?: string;
  showTabs?: boolean;
  showBreadcrumb?: boolean; // Nuevo: Ocultar breadcrumb
};

export type NavigationEvent = {
  // Ahora acepta un objeto de datos opcional
  navigate: (routePath: string, data?: any) => void;
  getCurrentPath: () => string;
  getRouteData: () => any; // Nuevo: Obtener datos de la ruta actual
};

export interface NavigationMap {
  [id: string]: NavigationEvent;
}

type NavigationData = {
  id: string;
  config?: NavigationConfig;
  routes: NavigationRoute[];
  onNavigate: ComponentEvent;
  context?: Context;
};

type NavigationFactory = (data: NavigationData) => Component;

export const Navigation: NavigationFactory = ({
  id,
  config,
  routes,
  onNavigate,
  context,
}) => {
  return {
    id,
    type: "Navigation",
    context,
    data: { routes },
    // Por defecto breadcrumb visible
    config: config ?? {
      homeLabel: "Inicio",
      showTabs: true,
      showBreadcrumb: true,
    },
    events: { onNavigate },
  };
};

// Tipos para el Editor
export const NavigationType = `
type NavigationRoute = {
  id: string;
  label: string;
  icon?: string;
  children?: Component[];
  subRoutes?: NavigationRoute[];
};

type NavigationConfig = {
  className?: string;
  homeLabel?: string;
  showTabs?: boolean;
  showBreadcrumb?: boolean;
};

interface NavigationProps {
  id: string;
  routes: NavigationRoute[];
  config?: NavigationConfig;
  onNavigate?: ComponentEvent;
  context?: Context;
}

interface NavigationFactory {
  (data: NavigationProps): Component;
}

declare const Navigation: NavigationFactory;
`;
export const NavigationEventsType = `
type NavigationEvent = {
  navigate: (routePath: string, data?: any) => void;
  getCurrentPath: () => string;
  getRouteData: () => any;
};

interface NavigationMap {
  [id: string]: NavigationEvent; 
}
`;
