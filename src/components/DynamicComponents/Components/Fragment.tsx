import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { DynamicComponent } from "../DynamicComponent"; // Asegúrate de que la ruta sea correcta
import { useMemo } from "react";

// El Fragment no suele tener config visual compleja ni data,
// su principal función es renderizar 'subComponents'.
type FragmentProps = Component & {
  context: Context;
};

export const DynamicFragment = ({ context, subComponents }: FragmentProps) => {
  // Normalizamos para asegurar que siempre sea un array
  const childrenToRender = useMemo(() => {
    if (!subComponents) return [];
    return Array.isArray(subComponents) ? subComponents : [subComponents];
  }, [subComponents]);

  // Si no hay hijos, no renderizamos nada
  if (childrenToRender.length === 0) return null;

  return (
    <>
      {childrenToRender.map((childComponent) => (
        <DynamicComponent
          key={childComponent.id}
          data={childComponent}
          context={context}
        />
      ))}
    </>
  );
};
