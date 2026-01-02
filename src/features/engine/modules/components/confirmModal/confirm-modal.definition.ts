import {
  IComponent,
  IComponentEvent,
  IContext,
} from "../../types/component.type";

// --- 1. Configuración ---

export interface IConfirmModalConfig {
  /** Título del modal */
  title?: string;
  /** Descripción o mensaje del cuerpo */
  description?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilos en línea */
  style?: React.CSSProperties;
  /** Texto del botón confirmar (opcional, si tu UI lo soporta) */
  confirmText?: string;
  /** Texto del botón cancelar (opcional, si tu UI lo soporta) */
  cancelText?: string;
}

// --- 2. Eventos (Planos) ---

export interface IConfirmModalEvents {
  /** Se ejecuta al confirmar la acción */
  onConfirm?: IComponentEvent;
  /** Se ejecuta al cancelar o cerrar el modal */
  onCancel?: IComponentEvent;
}

// --- 3. Props Principales ---

export interface IConfirmModalProps extends IConfirmModalEvents {
  id: string;
  config?: IConfirmModalConfig;
  context?: IContext;
  load?: () => void;
}

export type ConfirmModalFactory = (props: IConfirmModalProps) => IComponent;

// --- 4. Definiciones para el Editor (Strings) ---

export const CONFIRM_MODAL_TYPE_DEFINITION = `
interface IConfirmModalConfig {
  title?: string;
  description?: string;
  className?: string;
  style?: Record<string, any>;
  confirmText?: string;
  cancelText?: string;
}

interface IConfirmModalProps {
  id: string;
  config?: IConfirmModalConfig;
  
  // Eventos
  onConfirm?: IComponentEvent;
  onCancel?: IComponentEvent;
}

/** * Crea un Modal de Confirmación.
 * Útil para solicitar validación antes de una acción destructiva.
 */
declare const ConfirmModal: (props: IConfirmModalProps) => IComponent;
`;

// Definición de contexto vacía (por si en el futuro quieres métodos como .open() o .close())
export const CONFIRM_MODAL_CONTEXT_EVENT = {
  key: "confirmModal",
  name: "IConfirmModalMap",
  definition: "",
};
