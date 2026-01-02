import {
  IComponent,
  IComponentEvent,
  IContext,
  IComponentData,
} from "../../types/component.type";

// --- 1. Variantes y Configuración ---

export type TextVariant =
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

export type TextAlign = "left" | "center" | "right" | "justify";

/**
 * Configuración visual y de estilo del texto.
 */
export interface ITextConfig {
  /** Clases CSS adicionales (Tailwind) */
  className?: string;
  /** Estilos en línea */
  style?: React.CSSProperties;
  /** Variante tipográfica (h1, p, small, etc.) */
  variant?: TextVariant;
  /** Alineación del texto */
  align?: TextAlign;
}

// --- 2. Datos Dinámicos ---

export interface ITextData {
  /** El contenido del texto. Soporta binding dinámico. */
  content?: IComponentData<string>;
}

// --- 3. Eventos (Estructura Plana para DX) ---

export interface ITextEvents {
  /** Evento al hacer click en el texto */
  onClick?: IComponentEvent;
  onMouseEnter?: IComponentEvent;
  onMouseLeave?: IComponentEvent;
}

// --- 4. Props Principales ---

/**
 * Propiedades para construir el componente de Texto.
 */
export interface ITextProps extends ITextData, ITextEvents {
  id: string;
  config?: ITextConfig;
  context?: IContext;
  load?: () => void;
}

export type TextFactory = (props: ITextProps) => IComponent;

// --- 5. Definiciones para el Editor (Strings) ---

export const TEXT_TYPE_DEFINITION = `
/** Variantes tipográficas disponibles */
type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "lead" | "large" | "small" | "muted";
type TextAlign = "left" | "center" | "right" | "justify";

interface ITextConfig {
  className?: string;
  /** Estilos CSS en objeto. Ej: { color: 'red' } */
  style?: Record<string, any>;
  variant?: TextVariant;
  align?: TextAlign;
}

interface ITextProps {
  id: string;
  config?: ITextConfig;
  /** Contenido del texto */
  content?: IComponentData<string>;
  
  // Eventos
  onClick?: IComponentEvent;
  onMouseEnter?: IComponentEvent;
  onMouseLeave?: IComponentEvent;
}

/** Crea un componente de Texto */
declare const CText: (props: ITextProps) => IComponent;
`;

const TEXT_CONTEXT_EVENTS_DEFINITION = `
interface ITextExposedMethods {
  /** Actualiza el contenido del texto dinámicamente */
  setText: (text: string) => void;
  /** Obtiene el contenido actual */
  getText: () => string;
}

interface ITextMap {
  [id: string]: ITextExposedMethods;
}
`;

export const TEXT_CONTEXT_EVENT = {
  key: "txt", // Prefijo sugerido para textos
  name: "ITextMap",
  definition: TEXT_CONTEXT_EVENTS_DEFINITION,
};
