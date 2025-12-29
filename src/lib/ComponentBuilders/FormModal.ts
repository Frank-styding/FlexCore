import { FieldConfig } from "@/components/custom/DynamicForm";
import {
  Component,
  ComponentEvent,
  Context,
  DynamicValue,
  IComponentData,
} from "./Component";

// 1. Configuración
type FormModalConfig = {
  className?: string;
  classNameForm?: string;
  title?: string;
  description?: string;
  confirmName?: string;
  cancelName?: string;
};

// 3. Data (Esquema y Campos del formulario)
type FormModalDataDef = {
  schema?: any; // Zod schema o similar
  fields?: FieldConfig[]; // Definición de campos
  defaultValues: IComponentData<DynamicValue<any>>;
};

type FormModalData = {
  id: string;
  config?: FormModalConfig;
  data?: IComponentData<FormModalDataDef>;
  onSubmit: ComponentEvent; // Evento que recibe los datos del form
  context?: Context;
};

type FormModalFactory = (data: FormModalData) => Component;

export const FormModal: FormModalFactory = ({
  id,
  config,
  data,
  onSubmit,
  context,
}) => {
  return {
    id,
    type: "FormModal",
    context,
    data: data || {},
    config: config ?? {},
    events: { onSubmit },
  };
};

// 4. Tipos para el Editor
export const FormModalType = `
type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "date" | "icon";
  placeholder?: string;
  options?: { label: string; value: string }[]; // Solo para selects
  className?: string; // Para controlar el ancho (col-span-1, etc.)
};
type FormModalConfig = {
  className?: string;
  classNameForm?: string;
  title?: string;
  description?: string;
  confirmName?: string;
  cancelName?: string;
};

type FormModalDataDef = {
  schema?: any;
  fields?: FieldConfig[];
  defaultValues: IComponentData<DynamicValue<any>>;
};

interface FormModalProps {
  id: string;
  config?: FormModalConfig;
  data?: IComponentData<FormModalDataDef>;
  onSubmit?: ComponentEvent;
  context?: Context;
}

interface FormModalFactory {
  (data: FormModalProps): Component;
}

declare const FormModal: FormModalFactory;
`;
