import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useMemo } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
// Asegúrate de que la ruta de importación sea correcta según tu estructura
import { LoadingModal } from "@/components/custom/Modals/LoadingModal";
import { useModals } from "@/components/providers/ModalProvider";

type DynamicLoadingModalProps = Component & {
  context: Context;
  config: {
    className?: string;
  };
};

export const DynamicLoadingModal = ({
  config,
  context,
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

  // 2. Renderizamos el componente UI base
  return <LoadingModal id={id} {...config} />;
};
