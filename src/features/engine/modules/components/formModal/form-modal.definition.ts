import {
  IComponent,
  IComponentEvent,
  IContext,
  IComponentData,
} from "../../types/component.type";

// --- 1. Tipos Auxiliares ---
// Definición flexible para TS, pero detallada en el string del editor
export type FieldConfig = Record<string, any>;

// --- 2. Configuración Visual ---

export interface IFormModalConfig {
  className?: string;
  classNameForm?: string;
  title?: string;
  description?: string;
  /** Texto del botón confirmar */
  confirmName?: string;
  /** Texto del botón cancelar */
  cancelName?: string;
}

// --- 3. Datos del Formulario ---

export interface IFormModalData {
  /** Esquema de validación (Zod o config object) */
  schema?: any;
  /** Array de configuración de campos */
  fields?: FieldConfig[];
  /** Valores por defecto (se recargan al abrir el modal) */
  defaultValues?: IComponentData<any>;
}

// --- 4. Eventos ---

export interface IFormModalEvents {
  /** Se ejecuta al enviar el formulario correctamente */
  onSubmit?: IComponentEvent;
}

// --- 5. Props Principales ---

export interface IFormModalProps extends IFormModalData, IFormModalEvents {
  id: string;
  config?: IFormModalConfig;
  context?: IContext;
  load?: () => void;
}

export type FormModalFactory = (props: IFormModalProps) => IComponent;

// --- 6. Definiciones para el Editor (Strings) ---

export const FORM_MODAL_TYPE_DEFINITION = `
type FieldType = "text" | "number" | "email" | "select" | "date" | "icon" | "password" | "textarea";

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Opciones para tipo 'select' */
  options?: { label: string; value: string }[];
  /** Clases de grid (ej: 'col-span-2') */
  className?: string;
  [key: string]: any;
}

interface IFormModalConfig {
  className?: string;
  classNameForm?: string;
  title?: string;
  description?: string;
  confirmName?: string;
  cancelName?: string;
}

interface IFormModalProps {
  id: string;
  config?: IFormModalConfig;
  
  // Datos
  schema?: Record<string, any>;
  fields?: FieldConfig[];
  defaultValues?: IComponentData<any>;
  
  // Eventos
  onSubmit?: IComponentEvent;
}

/**
 * Crea un Modal que contiene un Formulario dinámico.
 * Los datos se recargan automáticamente cuando el modal se abre.
 */
declare const FormModal: (props: IFormModalProps) => IComponent;
`;

// Métodos expuestos para control via script
const FORM_MODAL_CONTEXT_EVENTS_DEFINITION = `
interface IFormModalExposedMethods {
  open: () => void;
  close: () => void;
}

interface IFormModalMap {
  [id: string]: IFormModalExposedMethods;
}
`;

export const FORM_MODAL_CONTEXT_EVENT = {
  key: "formModal",
  name: "IFormModalMap",
  definition: FORM_MODAL_CONTEXT_EVENTS_DEFINITION,
};
