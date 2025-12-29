/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useMemo } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
// Ajusta la ruta a donde tengas tu FormModal.tsx
import { FormModal } from "@/components/custom/Modals/FormModal";
import { useModals } from "@/components/providers/ModalProvider";
import { useScriptError } from "@/hooks/useScriptError";

type DynamicFormModalProps = Component & {
  context: Context;
  data: {
    schema?: any;
    fields?: any[];
  };
  config: {
    className?: string;
    classNameForm?: string;
    title?: string;
    description?: string;
    confirmName?: string;
    cancelName?: string;
  };
};

export const DynamicFormModal = ({
  config,
  events,
  context,
  id,
  data,
}: DynamicFormModalProps) => {
  const execute = useScriptError();

  // 1. Manejo del Submit
  const handleOnSubmit = (formData: any) => {
    // Ejecutamos el evento definido en el script
    execute(events.onSubmit, formData, context);
    // Opcional: Cerrar automáticamente al enviar si se desea
    // closeModal(id);
  };

  return (
    <FormModal
      id={id}
      {...config} // Pasa title, description, classNames
      schema={data.schema}
      fields={data.fields}
      onSubmit={handleOnSubmit}
    />
  );
};
