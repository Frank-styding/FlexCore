import { IComponent } from "../../types/component.type";
import { FormFactory } from "./form.definition";

export const Form: FormFactory = ({
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
    type: "Form", // Debe coincidir con index.ts y el registro
    context,
    load,
    // Empaquetamos la definición en data
    data: {
      schema,
      fields,
      defaultValues,
    },
    config: {
      confirmLabel: "Guardar",
      cancelLabel: "Cancelar",
      ...config,
    },
    events: componentEvents,
  };
};
