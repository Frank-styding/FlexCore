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
type FormDataDef = {
  schema?: any; // Zod schema o similar
  fields?: FieldConfig[]; // Definición de campos
  defaultValues: IComponentData<DynamicValue<any>>;
};

type FormData = {
  id: string;
  /* config?: FormModalConfig; */
  data?: IComponentData<FormDataDef>;
  onSubmit: ComponentEvent; // Evento que recibe los datos del form
  context?: Context;
};

type FormFactory = (data: FormData) => Component;

export const Form: FormFactory = ({
  id,
  /*   config, */
  data,
  onSubmit,
  context,
}) => {
  return {
    id,
    type: "FormModal",
    context,
    data: data || {},
    config: {},
    events: { onSubmit },
  };
};

// 4. Tipos para el Editor
export const FormType = `

// 3. Data (Esquema y Campos del formulario)
type FormDataDef = {
  schema?: any; // Zod schema o similar
  fields?: FieldConfig[]; // Definición de campos
  defaultValues: IComponentData<DynamicValue<any>>;
};

type FormProps = {
  id: string;
  /* config?: FormModalConfig; */
  data?: IComponentData<FormDataDef>;
  onSubmit: ComponentEvent; // Evento que recibe los datos del form
  context?: Context;
};

interface FormFactory {
  (data: FormProps): Component;
}

declare const FormModal: FormFactory;
`;
