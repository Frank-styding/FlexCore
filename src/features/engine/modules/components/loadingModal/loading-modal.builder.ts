import { IComponent } from "../../types/component.type";
import { LoadingModalFactory } from "./loading-modal.definition";

export const LoadingModal: LoadingModalFactory = ({
  id,
  config = {},
  context,
  load,
  // Eventos planos
  onOpen,
  onClose,
}): IComponent => {
  // Construcción de eventos
  const componentEvents: Record<string, any> = {};

  if (onOpen) componentEvents.onOpen = onOpen;
  if (onClose) componentEvents.onClose = onClose;

  return {
    id,
    type: "LoadingModal",
    context,
    load,
    config: {
      ...config,
    },
    data: {},
    events: componentEvents,
    subComponents: [],
  };
};
