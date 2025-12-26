/* eslint-disable react-hooks/immutability */
import { Button } from "@/components/ui/button";
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useEffect, useRef, useState } from "react";

export const DynamicButton = ({
  config,
  events,
  context,
  id,
}: Component & { context: Context }) => {
  const [label, setLabelState] = useState(config?.label);
  // 2. Crear una referencia que siempre tendrá el valor real
  const labelRef = useRef(config?.label);

  const handleOnClick = (e: any) => {
    events.onClick?.(e, context);
  };

  // Función interna para actualizar ambos (Estado y Referencia)
  const updateLabel = (newValue: string) => {
    labelRef.current = newValue; // Actualizamos la referencia (instantáneo)
    setLabelState(newValue); // Actualizamos el estado (renderizado)
  };

  useEffect(() => {
    if (!context) return;
    if (!context.comp) {
      context.comp = {};
    }

    context.comp[id] = {
      setLabel: (value: any) => {
        updateLabel(value); // Usamos nuestra función wrapper
      },
      getLabel: () => {
        // 3. AQUÍ ESTÁ LA MAGIA: Leemos de la referencia, no del estado
        return labelRef.current;
      },
    };

    return () => {
      if (context.comp && context.comp[id]) {
        delete context.comp[id];
      }
    };
    // Ya no necesitamos 'label' en las dependencias, evitando bucles infinitos
  }, [context, id]);

  return (
    <Button {...config} onClick={handleOnClick}>
      {label}
    </Button>
  );
};
