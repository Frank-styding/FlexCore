import {
  BuildFuncs,
  Component,
  ComponentEvent,
  DynamicValue,
  Context,
  IComponentData,
} from "./Component";

// 1. Configuración Visual
type TextConfig = {
  className?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "lead"
    | "large"
    | "small"
    | "muted";
  align?: "left" | "center" | "right" | "justify";
};

// 2. Eventos expuestos
export type TextEvent = {
  setText: (text: string) => void;
  getText: () => string;
};

export interface TextMap {
  [id: string]: TextEvent;
}

// 3. Estructura de datos
type TextData = {
  id: string;
  config?: TextConfig;
  content?: IComponentData<DynamicValue<string>>; // El contenido del texto
  onClick: ComponentEvent; // Opcional: hacer click en el texto
  buildFuncs: BuildFuncs;
  context?: Context;
};

type TextFactory = (data: TextData) => Component;

// 4. Factory
export const CText: TextFactory = ({
  id,
  config,
  content,
  onClick,
  buildFuncs,
  context,
}) => {
  return {
    id,
    type: "Text",
    context,
    data: { content },
    config: config ?? { variant: "p", align: "left" },
    events: { onClick },
    buildFuncs,
  };
};

// 5. String Types para el Editor
export const TextType = `
type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "lead" | "large" | "small" | "muted";
type TextAlign = "left" | "center" | "right" | "justify";

type TextConfig = {
  className?: string;
  style?:Record<string,any>;
  variant?: TextVariant;
  align?: TextAlign;
};

interface TextProps {
  id: string;
  content?: IComponentData<DynamicValue<string>>; // El contenido del texto
  config?: TextConfig;
  onClick?: ComponentEvent;
  buildFuncs?: BuildFuncs;
  context?: Context;
}

interface TextFactory {
  (data: TextProps): Component;
}

declare const CText: TextFactory;
`;
export const TextEventsType = `
type TextEvent = {
  setText: (text: string) => void;
  getText: () => string;
};

interface TextMap {
  [id: string]: TextEvent;
}
`;
