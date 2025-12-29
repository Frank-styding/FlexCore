import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { LoadingModal } from "@/components/custom/Modals/LoadingModal";
import { useScriptError } from "@/hooks/useScriptError";

type DynamicLoadingModalProps = Component & {
  context: Context;
  config: {
    className?: string;
  };
};

export const DynamicLoadingModal = ({
  config,
  context,
  events,
  id,
}: DynamicLoadingModalProps) => {
  /*   const { openModal, closeModal } = useModals(); */

  // 1. Exponemos los métodos open/close al contexto
  /*   const exposedMethods = useMemo(
    () => ({
      open: (data?: { message?: string; subMessage?: string }) =>
        openModal(id, data),
      close: () => closeModal(id),
    }),
    [openModal, closeModal, id]
  );

  useComponentRegistration(context, "loading", id, exposedMethods); */
  const execute = useScriptError();
  const onOpen = async () => {
    await execute(events.onOpen, undefined, context);
  };
  const onClose = async () => {
    await execute(events.onClose, undefined, context);
  };
  // 2. Renderizamos el componente UI base
  return <LoadingModal id={id} {...config} onOpen={onOpen} onClose={onClose} />;
};
