import { IComponent } from "../../types/component.type";
import { ITextProps } from "./text.definition";

interface ITextFactory {
  (data: ITextProps): IComponent;
}

export const CText: ITextFactory = ({
  id,
  config = {},
  content,
  context,
  load,
  // Desestructuramos eventos planos
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Construimos el objeto events dinámicamente
  const componentEvents: Record<string, any> = {};

  if (onClick) componentEvents.onClick = onClick;
  if (onMouseEnter) componentEvents.onMouseEnter = onMouseEnter;
  if (onMouseLeave) componentEvents.onMouseLeave = onMouseLeave;

  return {
    id,
    type: "CText",
    context,
    load,
    data: { content },
    config: {
      variant: "p", // Default seguro
      align: "left",
      ...config,
    },
    events: componentEvents,
  };
};
