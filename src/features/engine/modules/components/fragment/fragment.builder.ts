import { IComponent } from "../../types/component.type";
import { FragmentFactory } from "./fragment.definition";

export const Fragment: FragmentFactory = (
  { id, context },
  children = [] // Segundo argumento: Array de hijos
): IComponent => {
  return {
    id,
    type: "Fragment",
    context,
    config: {}, // Vacío intencionalmente
    data: {}, // Vacío intencionalmente
    events: {}, // Vacío intencionalmente
    subComponents: children,
  };
};
