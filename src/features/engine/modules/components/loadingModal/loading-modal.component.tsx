import { useMemo } from "react";
import { useScriptError } from "@/features/engine/hooks/useConnectionError"; // Ajusta ruta
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration"; // Ajusta ruta
import { LoadingModal as SharedLoadingModal } from "@/components/shared/modals/LoadingModal"; // Ajusta ruta
import { IComponent, IContext } from "../../types/component.type";
import { ILoadingModalProps } from "./loading-modal.definition";

export const DynamicLoadingModal = ({
  config = {},
  events,
  id,
  context,
}: IComponent & ILoadingModalProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Handlers de eventos
  const handleOnOpen = async () => {
    if (events?.onOpen) {
      await execute(events.onOpen, undefined, context);
    }
  };

  const handleOnClose = async () => {
    if (events?.onClose) {
      await execute(events.onClose, undefined, context);
    }
  };

  // 2. Registro de métodos en el contexto (API para scripts)
  // Nota: Aquí deberías conectar tu lógica real de abrir/cerrar si usas un store global (Zustand/Redux)
  // Si no usas store y lo controlas por props, estos métodos podrían no hacer nada o necesitarías un estado local.
  const exposedMethods = useMemo(
    () => ({
      open: (data?: { message?: string; subMessage?: string }) => {
        console.log("Open loading modal via script", id, data);
        // Aquí iría tu lógica: openModal(id, data)
      },
      close: () => {
        console.log("Close loading modal via script", id);
        // Aquí iría tu lógica: closeModal(id)
      },
    }),
    [id]
  );

  useComponentRegistration(context, "loading", id, exposedMethods);

  // 3. Renderizado
  return (
    <SharedLoadingModal
      id={id}
      {...config}
      className={config.className} // Aseguramos que className pase si config lo tiene
      onOpen={handleOnOpen}
      onClose={handleOnClose}
    />
  );
};
