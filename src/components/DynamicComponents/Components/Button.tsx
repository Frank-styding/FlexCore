/* eslint-disable react-hooks/immutability */
import { Button } from "@/components/ui/button";
import { useDynamicValue } from "@/components/DynamicComponents/useDynamicValue";
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useMemo } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
import { useScriptError } from "@/hooks/useScriptError";

export const DynamicButton = ({
  config,
  events,
  context,
  id,
  data,
}: Component & { context: Context }) => {
  const [labelRef, setLabel, label] = useDynamicValue(context, data.label, "");
  const execute = useScriptError();

  const handleOnClick = (e: any) => {
    execute(events.onClick, e, context);
  };

  const exposedMethods = useMemo(
    () => ({
      setLabel: (value: string) => setLabel(value),
      getLabel: () => labelRef.current,
    }),
    [setLabel, labelRef]
  ); // Dependencias estables

  // 2. Usamos el Hook para registrar en context.comp.btn[id]
  useComponentRegistration(context, "btn", id, exposedMethods);

  return (
    <Button {...config} onClick={handleOnClick}>
      {label}
    </Button>
  );
};
