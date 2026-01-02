import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { ConfirmModal as SharedConfirmModal } from "@/components/shared/modals/ConfirmModal"; // Tu componente UI base
import { IComponent, IContext } from "../../types/component.type";
import { IConfirmModalProps } from "./confirm-modal.definition";
import { useMemo } from "react";

export const DynamicConfirmModal = ({
  config = {},
  events,
  id,
  context,
}: IComponent & IConfirmModalProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Handlers de eventos
  const handleOnConfirm = () => {
    if (events?.onConfirm) {
      execute(events.onConfirm, undefined, context);
    }
  };

  const handleOnCancel = () => {
    if (events?.onCancel) {
      execute(events.onCancel, undefined, context);
    }
  };

  // 2. Registro (opcional, pero buena práctica)
  const exposedMethods = useMemo(() => ({}), []);
  useComponentRegistration(context, "confirmModal", id, exposedMethods);

  return (
    <SharedConfirmModal
      id={id}
      title={config.title}
      description={config.description}
      className={config.className}
      // Pasamos los handlers que ejecutan el script
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
      // Si tu componente UI soporta style, pásalo también
      // style={config.style}
    />
  );
};
