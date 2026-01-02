import {
  IComponent,
  IComponentEvent,
  IContext,
  IComponentData,
} from "../../types/component.type";

// --- 1. Tipos de Variantes y Configuración ---

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

/**
 * Configuración visual y de comportamiento del botón.
 */
export interface IButtonConfig {
  className?: string;
  style?: React.CSSProperties;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

// --- 2. Datos Dinámicos ---

export interface IButtonData {
  /** Texto del botón (soporta binding dinámico) */
  label?: IComponentData<string>;
}

// --- 3. Eventos (Estructura Plana para DX) ---

export interface IButtonEvents {
  onClick?: IComponentEvent;
  onMouseEnter?: IComponentEvent;
  onMouseLeave?: IComponentEvent;
  onFocus?: IComponentEvent;
  onBlur?: IComponentEvent;
}

// --- 4. Props Principales ---

/**
 * Propiedades del componente Button.
 * Los eventos se definen en el nivel raíz para mejorar la DX.
 */
export interface IButtonProps extends IButtonData, IButtonEvents {
  id: string;
  config?: IButtonConfig;
  context?: IContext;
  load?: () => void;
}

export type ButtonFactory = (props: IButtonProps) => IComponent;

// --- 5. Definiciones para el Editor (Strings) ---

export const BUTTON_TYPE_DEFINITION = `
/** Opciones visuales */
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface IButtonConfig {
  className?: string;
  /** Estilos CSS en objeto. Ej: { backgroundColor: 'red' } */
  style?: Record<string, any>; 
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

/** Propiedades del Botón */
interface IButtonProps {
  id: string;
  config?: IButtonConfig;
  label?: IComponentData<string>;
  
  // Eventos
  onClick?: IComponentEvent;
  onMouseEnter?: IComponentEvent;
  onMouseLeave?: IComponentEvent;
  onFocus?: IComponentEvent;
  onBlur?: IComponentEvent;
}

/** Crea un componente Botón */
declare const Button: (props: IButtonProps) => IComponent;
`;

const BUTTON_CONTEXT_EVENTS_DEFINITION = `
interface IButtonExposedMethods {
  setLabel: (value: string) => void;
  getLabel: () => string;
  setDisabled: (disabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  click: () => void;
}

interface IButtonMap {
  [id: string]: IButtonExposedMethods;
}
`;

export const BUTTON_CONTEXT_EVENT = {
  key: "btn",
  name: "IButtonMap",
  definition: BUTTON_CONTEXT_EVENTS_DEFINITION,
};
