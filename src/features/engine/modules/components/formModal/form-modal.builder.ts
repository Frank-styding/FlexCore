import { IComponent } from "../../types/component.type";
import { FormModalFactory } from "./form-modal.definition";

export const FormModal: FormModalFactory = ({
  id,
  config = {},
  // Datos extraídos del nivel raíz
  schema,
  fields,
  defaultValues,
  context,
  load,
  // Eventos
  onSubmit,
}) => {
  const componentEvents: Record<string, any> = {};

  if (onSubmit) componentEvents.onSubmit = onSubmit;

  return {
    id,
    type: "FormModal",
    context,
    load,
    // Estructuramos los datos para el componente
    data: {
      schema,
      fields,
      defaultValues,
    },
    config: {
      confirmName: "Guardar",
      cancelName: "Cancelar",
      ...config,
    },
    events: componentEvents,
  };
};
