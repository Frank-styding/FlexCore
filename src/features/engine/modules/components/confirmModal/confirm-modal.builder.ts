import { IComponent } from "../../types/component.type";
import { ConfirmModalFactory } from "./confirm-modal.definition";

export const ConfirmModal: ConfirmModalFactory = ({
  id,
  config = {},
  context,
  load,
  // Desestructuramos los eventos planos
  onConfirm,
  onCancel,
}): IComponent => {
  // Construimos el objeto events para el motor
  const componentEvents: Record<string, any> = {};

  if (onConfirm) componentEvents.onConfirm = onConfirm;
  if (onCancel) componentEvents.onCancel = onCancel;

  return {
    id,
    type: "ConfirmModal",
    context,
    load,
    config: {
      title: "Are you sure?", // Valores por defecto seguros
      description: "This action cannot be undone.",
      ...config,
    },
    data: {},
    events: componentEvents,
    subComponents: [], // Es un componente hoja, no suele tener hijos dinámicos
  };
};
