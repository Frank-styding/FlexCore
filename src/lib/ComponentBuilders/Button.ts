import {
  Component,
  ComponentEvent,
  DynamicValue,
  Context,
  IComponentData,
} from "./Component";

type ButtonConfig = {
  className?: string;
  style?: string;
  variant?: "outline" | "default";
  icon: string;
};

export type ButtonEvent = {
  setLabel: (value: string) => void;
  getLabel: () => void;
};
export interface ButtonMap {
  // Al usar esta sintaxis, forzamos a TS a creer que siempre devuelve un evento
  // y eliminamos el riesgo de "undefined" que rompe el intellisense
  [id: string]: ButtonEvent;
}

type Button = (data: {
  id: string;
  config?: ButtonConfig;
  onClick: ComponentEvent;
  context?: Context;
  label?: IComponentData<DynamicValue<string>>;
}) => Component;

export const Button: Button = ({ id, config, label, onClick, context }) => {
  return {
    id,
    type: "Button",
    context,
    data: { label },
    config: config ?? {},
    events: { onClick },
  };
};

export const ButtonType = `
type ButtonConfig = {
  className?: string;
  style?: string;
  variant?: "outline" | "default";
  icon: string;
};

interface ButtonProps {
  id: string;
  label?: IComponentData<DynamicValue<string>>;
  config?: ButtonConfig; // Aquí ocurre la magia
  onClick?: ComponentEvent;     // Opcional para facilitar pruebas
  context?: Context;
}

interface ButtonFactory {
  (data: ButtonProps): Component;
}

declare const Button: ButtonFactory;

`;

export const ButtonEventsType = `
type ButtonEvent = {
  setLabel: (value: string) => void;
  getLabel: () => string;
};
interface ButtonMap {
  // Al usar esta sintaxis, forzamos a TS a creer que siempre devuelve un evento
  // y eliminamos el riesgo de "undefined" que rompe el intellisense
  [id: string]: ButtonEvent; 
}
`;
