import { useEffect, useMemo } from "react";
// Asegúrate de que esta ruta apunte a tu componente UI compartido
import { FormModal as UIFormModal } from "@/components/shared/modals/FormModal";

// Hooks del Engine
import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { useDynamicValue } from "@/features/engine/hooks/useDynamicValue";
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { useIsModalOpen, useModalActions } from "@/hooks/useModal"; // Hooks globales de modal

import { IComponent, IContext } from "../../types/component.type";
import { IFormModalProps } from "./form-modal.definition";

export const DynamicFormModal = ({
  config = {},
  events,
  context,
  id,
  data,
}: IComponent & IFormModalProps & { context: IContext }) => {
  const execute = useScriptError();
  const { openModal, closeModal } = useModalActions();
  const isOpen = useIsModalOpen(id);

  // 1. Manejo de Valores Dinámicos
  // 'reload' es vital para refrescar datos al abrir el modal
  const [_, __, defaultValues, reload] = useDynamicValue(
    context,
    data?.defaultValues,
    {}
  );

  // 2. Efecto de Recarga
  // Cuando el modal se abre (isOpen cambia a true), recargamos los valores
  useEffect(() => {
    if (isOpen) {
      reload();
    }
  }, [isOpen, reload]);

  // 3. Manejo de Submit
  const handleOnSubmit = (formData: any) => {
    if (events?.onSubmit) {
      execute(events.onSubmit, formData, context);
    }
  };

  // 4. Registro de componente en el contexto (API para scripts)
  // Permite: formModal.miModal.open()
  const exposedMethods = useMemo(
    () => ({
      open: (modalData?: any) => openModal(id, modalData),
      close: () => closeModal(id),
    }),
    [id, openModal, closeModal]
  );

  useComponentRegistration(context, "formModal", id, exposedMethods);

  return (
    <UIFormModal
      id={id}
      {...config}
      // Configuración Visual
      className={config.className}
      classNameForm={config.classNameForm}
      title={config.title}
      description={config.description}
      confirmName={config.confirmName}
      /*       cancelName={config.cancelName} */

      // Datos
      schema={data?.schema}
      fields={data?.fields}
      defaultValues={defaultValues}
      // Eventos
      onSubmit={handleOnSubmit}
    />
  );
};
