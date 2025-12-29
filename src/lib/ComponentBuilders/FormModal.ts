import { BuildFuncs, Component, ComponentEvent, Context } from "./Component";

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
  fields?: any[]; // Definición de campos
};

type FormModalData = {
  id: string;
  config?: FormModalConfig;
  data?: FormModalDataDef;
  onSubmit: ComponentEvent; // Evento que recibe los datos del form
  buildFuncs: BuildFuncs;
  context?: Context;
};

type FormModalFactory = (data: FormModalData) => Component;

export const FormModal: FormModalFactory = ({
  id,
  config,
  data,
  onSubmit,
  buildFuncs,
  context,
}) => {
  return {
    id,
    type: "FormModal",
    context,
    data: data || {},
    config: config ?? {},
    events: { onSubmit },
    buildFuncs,
  };
};

// 4. Tipos para el Editor
export const FormModalType = `
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
  fields?: any[];
};

interface FormModalProps {
  id: string;
  config?: FormModalConfig;
  data?: FormModalDataDef;
  onSubmit?: ComponentEvent;
  buildFuncs?: BuildFuncs;
  context?: Context;
}

interface FormModalFactory {
  (data: FormModalProps): Component;
}

declare const FormModal: FormModalFactory;
`;
