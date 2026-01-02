import { IComponent } from "../../types/component.type";
import { ILayoutProps, LayoutFactory } from "./layout.definition";

export const Layout: LayoutFactory = (
  {
    id,
    config = {},
    context,
    // Eventos planos
    onClick,
    onMouseEnter,
    onMouseLeave,
  }: ILayoutProps,
  children = [] // Segundo argumento: Array de componentes hijos
): IComponent => {
  // Construcción dinámica de eventos
  const componentEvents: Record<string, any> = {};
  if (onClick) componentEvents.onClick = onClick;
  if (onMouseEnter) componentEvents.onMouseEnter = onMouseEnter;
  if (onMouseLeave) componentEvents.onMouseLeave = onMouseLeave;

  return {
    id,
    type: "Layout", // Debe coincidir con el nombre en index.ts
    context,
    config: {
      ...config,
    },
    data: {}, // Layout usualmente no tiene data compleja
    events: componentEvents,
    subComponents: children, // Aquí se asignan los hijos
  };
};
