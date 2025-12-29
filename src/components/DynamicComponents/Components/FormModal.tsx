import {
  Component,
  Context,
  DynamicValue,
  IComponentData,
} from "@/lib/ComponentBuilders/Component";
import { FormModal } from "@/components/custom/Modals/FormModal";
import { useScriptError } from "@/hooks/useScriptError";
import { useDynamicValue } from "../useDynamicValue";
import { useCallback, useEffect } from "react";
import { useModals } from "@/components/providers/ModalProvider";

type DynamicFormModalProps = Component & {
  context: Context;
  data: {
    schema?: any;
    fields?: any[];
    defaultValues: IComponentData<DynamicValue<any>>;
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
  const [_, __, defaultValues, reload] = useDynamicValue(
    context,
    data.defaultValues,
    {}
  );

  const { isModalOpen } = useModals();

  const handleOnSubmit = (formData: any) => {
    execute(events.onSubmit, formData, context);
  };

  const isOpen = isModalOpen(id);
  useEffect(() => {
    if (isOpen) {
      reload();
    }
  }, [isOpen, reload]);

  return (
    <FormModal
      id={id}
      {...config} // Pasa title, description, classNames
      schema={data.schema}
      fields={data.fields}
      defaultValues={defaultValues}
      onSubmit={handleOnSubmit}
    />
  );
};
