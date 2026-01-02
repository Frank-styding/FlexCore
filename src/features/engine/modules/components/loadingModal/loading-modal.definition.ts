import {
  IComponent,
  IComponentEvent,
  IContext,
} from "../../types/component.type";

// --- 1. Configuración ---

export interface ILoadingModalConfig {
  /** Clases CSS adicionales */
  className?: string;
  /** Estilos en línea */
  style?: React.CSSProperties;
  /** Título del mensaje de carga */
  title?: string;
  /** Subtítulo o descripción */
  description?: string;
  /** Evitar cerrar con tecla ESC */
  disableEscape?: boolean;
  /** Evitar cerrar al hacer clic fuera */
  disableOutside?: boolean;
}

// --- 2. Eventos (Planos) ---

export interface ILoadingModalEvents {
  /** Se ejecuta cuando el modal se abre */
  onOpen?: IComponentEvent;
  /** Se ejecuta cuando el modal se cierra */
  onClose?: IComponentEvent;
}

// --- 3. Props Principales ---

export interface ILoadingModalProps extends ILoadingModalEvents {
  id: string;
  config?: ILoadingModalConfig;
  context?: IContext;
  load?: () => void;
}

export type LoadingModalFactory = (props: ILoadingModalProps) => IComponent;

// --- 4. Definiciones para el Editor (Strings) ---

export const LOADING_MODAL_TYPE_DEFINITION = `
interface ILoadingModalConfig {
  className?: string;
  style?: Record<string, any>;
  title?: string;
  description?: string;
  disableEscape?: boolean;
  disableOutside?: boolean;
}

interface ILoadingModalProps {
  id: string;
  config?: ILoadingModalConfig;
  
  // Eventos
  onOpen?: IComponentEvent;
  onClose?: IComponentEvent;
}

/**
 * Crea un Modal de Carga.
 * Bloquea la interacción del usuario mientras se realiza una operación.
 */
declare const LoadingModal: (props: ILoadingModalProps) => IComponent;
`;

// Definición de métodos expuestos (útil para scripts: loading.open(), loading.close())
const LOADING_MODAL_CONTEXT_EVENTS_DEFINITION = `
interface ILoadingModalExposedMethods {
  open: (data?: { message?: string; subMessage?: string }) => void;
  close: () => void;
}

interface ILoadingModalMap {
  [id: string]: ILoadingModalExposedMethods;
}
`;

export const LOADING_MODAL_CONTEXT_EVENT = {
  key: "loading",
  name: "ILoadingModalMap",
  definition: LOADING_MODAL_CONTEXT_EVENTS_DEFINITION,
};
