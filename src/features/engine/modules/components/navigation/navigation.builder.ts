import { IComponent } from "../../types/component.type";
import { NavigationFactory } from "./navigation.definition";

export const Navigation: NavigationFactory = ({
  id,
  config = {},
  routes,
  context,
  load,
  // Eventos planos
  onNavigate,
}): IComponent => {
  // Construcción de eventos
  const componentEvents: Record<string, any> = {};
  if (onNavigate) componentEvents.onNavigate = onNavigate;

  return {
    id,
    type: "Navigation",
    context,
    load,
    data: { routes },
    config: {
      homeLabel: "Inicio",
      showTabs: true,
      showBreadcrumb: true,
      ...config,
    },
    events: componentEvents,
  };
};
