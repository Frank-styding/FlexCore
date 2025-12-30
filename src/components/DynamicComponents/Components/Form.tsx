import {
  Component,
  Context,
  DynamicValue,
  IComponentData,
} from "@/lib/ComponentBuilders/Component";
import { useScriptError } from "@/hooks/useScriptError";
import { useDynamicValue } from "../useDynamicValue";
import { useCallback, useEffect } from "react";
import { DynamicForm as Form } from "@/components/custom/DynamicForm";

type DynamicFormProps = Component & {
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

export const DynamicForm = ({
  config,
  events,
  context,
  data,
}: DynamicFormProps) => {
  const execute = useScriptError();
  const [_, __, defaultValues, reload] = useDynamicValue(
    context,
    data.defaultValues,
    {}
  );

  const handleOnSubmit = (formData: any) => {
    execute(events.onSubmit, formData, context);
  };

  return (
    <Form
      {...config} // Pasa title, description, classNames
      schema={data.schema}
      fields={data.fields}
      defaultValues={defaultValues}
      onSubmit={handleOnSubmit}
    />
  );
};
