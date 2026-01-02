import { IComponent } from "../../types/component.type";
import { IButtonProps } from "./button.definition";

interface IButtonFactory {
  (data: IButtonProps): IComponent;
}

export const Button: IButtonFactory = ({
  id,
  config = {},
  label,
  context,
  load,
  // Eventos planos
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) => {
  // Mapeamos los eventos planos al objeto 'events' que usa el motor internamente
  const componentEvents: Record<string, any> = {};

  if (onClick) componentEvents.onClick = onClick;
  if (onMouseEnter) componentEvents.onMouseEnter = onMouseEnter;
  if (onMouseLeave) componentEvents.onMouseLeave = onMouseLeave;
  if (onFocus) componentEvents.onFocus = onFocus;
  if (onBlur) componentEvents.onBlur = onBlur;

  return {
    id,
    type: "Button",
    context,
    load,
    data: { label },
    config: {
      variant: "default",
      size: "default",
      ...config,
    },
    events: componentEvents,
  };
};
