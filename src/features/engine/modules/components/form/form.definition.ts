import {
  IComponent,
  IComponentEvent,
  IContext,
  IComponentData,
} from "../../types/component.type";

// --- 1. Tipos Auxiliares (FieldConfig placeholder) ---
// Asumimos que FieldConfig viene de tu librería de UI, pero lo definimos genérico aquí
export type FieldConfig = Record<string, any>;

// --- 2. Configuración Visual ---

export interface IFormConfig {
  className?: string;
  classNameForm?: string;
  title?: string;
  description?: string;
  /** Texto del botón de confirmar/enviar */
  confirmLabel?: string;
  /** Texto del botón de cancelar */
  cancelLabel?: string;
}

// --- 3. Datos del Formulario ---

export interface IFormData {
  /** Esquema de validación (ej: Zod Schema serializado o objeto config) */
  schema?: any;
  /** Definición de los campos (Array de configuración) */
  fields?: FieldConfig[];
  /** Valores iniciales (soporta binding dinámico) */
  defaultValues?: IComponentData<any>;
}

// --- 4. Eventos ---

export interface IFormEvents {
  /** Se ejecuta al enviar el formulario con éxito. Recibe los datos { ... } */
  onSubmit?: IComponentEvent;
}

// --- 5. Props Principales ---

export interface IFormProps extends IFormData, IFormEvents {
  id: string;
  config?: IFormConfig;
  context?: IContext;
  load?: () => void;
}

export type FormFactory = (props: IFormProps) => IComponent;

// --- 6. Definiciones para el Editor (Strings) ---

export const FORM_TYPE_DEFINITION = `
interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "checkbox" | "textarea" | "password";
  placeholder?: string;
  [key: string]: any;
}

interface IFormConfig {
  className?: string;
  classNameForm?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface IFormProps {
  id: string;
  config?: IFormConfig;
  
  // Datos
  schema?: Record<string, any>;
  fields?: FieldConfig[];
  defaultValues?: IComponentData<any>;

  // Eventos
  onSubmit?: IComponentEvent;
}

/**
 * Crea un Formulario Dinámico basado en un esquema y campos.
 */
declare const Form: (props: IFormProps) => IComponent;
`;

// No suele exponer métodos públicos, pero dejamos la estructura lista
export const FORM_CONTEXT_EVENT = {
  key: "form",
  name: "IFormMap",
  definition: "",
};
