/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { COMPONENTS } from "./Components";
import { ReactNode, memo, useId } from "react";
import { v4 as uuid } from "uuid";

// OPTIMIZACIÓN: Memoizar el componente recursivo
export const DynamicComponent = memo(
  ({ data, context }: { data?: Component; context?: Context }) => {
    // 1. Hook incondicional al inicio
    const generatedId = useId();

    if (!data) return null;

    const TargetComponent = COMPONENTS[data.type] as
      | (({}: any) => ReactNode)
      | undefined;

    if (!TargetComponent) return null;

    // 2. Inicializamos el ID del componente ACTUAL si no existe
    // eslint-disable-next-line react-hooks/immutability
    if (!data.id) {
      // eslint-disable-next-line react-hooks/immutability
      data.id = generatedId;
    }

    if (typeof data.config.style == "string") {
      data.config.style = undefined;
    }

    return (
      <TargetComponent {...data} context={context}>
        {data.subComponents &&
          (Array.isArray(data.subComponents) ? (
            data.subComponents.map((item, index) => {
              // 3. Inicializamos el ID del SUB-COMPONENTE si no existe
              // Usamos el ID del padre + el índice para garantizar unicidad sin romper reglas de hooks
              if (!item.id) {
                // eslint-disable-next-line react-hooks/immutability
                item.id = uuid();
              }

              return (
                <DynamicComponent
                  data={item}
                  // Ahora item.id siempre existe, así que la key es segura
                  key={item.id}
                  context={context}
                />
              );
            })
          ) : (
            // Caso de un solo subComponente (no array)
            <DynamicComponent data={data.subComponents} context={context} />
          ))}
      </TargetComponent>
    );
  }
);

DynamicComponent.displayName = "DynamicComponent";
